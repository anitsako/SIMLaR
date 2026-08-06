import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import { eq, sql } from 'drizzle-orm';
import { updateProyectoMineroFn } from './update-proyecto-minero.fn';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { proyectosMinerosTable } from '@/db/schemas/proyectos-mineros.schema';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { proyectosMinerosEtapasTable } from '@/db/schemas/proyectos-mineros-etapas.schema';
import { proyectosMinerosTiposTable } from '@/db/schemas/proyectos-mineros-tipos.schema';
import { usuariosTable } from '@/db/schemas/usuarios.schema';
import { runTestServerFn } from '@/tests/run-test-server-fn';

vi.mock('@/auth/use-app-session', () => ({ useAppSession: vi.fn() }));

const testUsername = process.env.TEST_USERNAME;
if (!testUsername) throw new Error('Missing TEST_USERNAME environment variable');

const PNG_1X1_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQAABjE+ibYAAAAASUVORK5CYII=';
const TEMP_NOMBRE = `tmp-upm-${String(Date.now()).slice(-7)}`;
const TEST_FILES_PATH = path.join(process.cwd(), '.test-files');
const originalFilesPath = process.env.FILES_PATH;

let testUserId: number;
let tempTipoId: number;
let tempEtapaId: number;
let tempProyectoId: number;
let tempArchivoMapaId: string;

beforeAll(async () => {
  process.env.FILES_PATH = TEST_FILES_PATH;

  const usuarios = await db
    .select({ id: usuariosTable.id })
    .from(usuariosTable)
    .where(eq(usuariosTable.username, testUsername));

  if (usuarios.length === 0) {
    throw new Error(`Usuario '${testUsername}' no encontrado`);
  }

  const usuario = usuarios[0];
  testUserId = usuario.id;

  const tipos = await db.select({ id: proyectosMinerosTiposTable.id }).from(proyectosMinerosTiposTable);

  if (tipos.length === 0) {
    throw new Error('No se encontró un tipo de proyecto minero');
  }

  const tipo = tipos[0];
  tempTipoId = tipo.id;

  const etapas = await db.select({ id: proyectosMinerosEtapasTable.id }).from(proyectosMinerosEtapasTable);

  if (etapas.length === 0) {
    throw new Error('No se encontró una etapa de proyecto minero');
  }

  const etapa = etapas[0];
  tempEtapaId = etapa.id;

  const [archivoMapa] = await db
    .insert(archivosTable)
    .values({
      nombre: `${TEMP_NOMBRE}.png`,
      tamaño: 100,
      mimeType: 'image/png',
      usuarioCreadorId: testUserId,
      usuarioModificadorId: testUserId,
    })
    .returning({ id: archivosTable.id });
  tempArchivoMapaId = archivoMapa.id;

  const [proyecto] = await db
    .insert(proyectosMinerosTable)
    .values({
      nombre: TEMP_NOMBRE,
      tipoId: tempTipoId,
      ubicacion: 'Ubicación inicial',
      provinciaGeologica: 'Provincia inicial',
      area: '100',
      areaHectareas: 100,
      litologia: 'Litología inicial',
      mineralizacion: 'Mineralización inicial',
      mineralInteres: 'Oro',
      modeloGenetico: 'Modelo inicial',
      accesos: 'Accesos iniciales',
      etapaId: tempEtapaId,
      propietario: 'Propietario inicial',
      localidadesCercanas: 'Localidad inicial',
      coordenadasGeograficas: sql`ST_SetSRID(ST_MakePoint(-68.5, -30.0), 4326)`,
      msnm: 1500,
      convenioEmse: false,
      archivoMapaId: tempArchivoMapaId,
      visible: true,
      usuarioCreadorId: testUserId,
      usuarioModificadorId: testUserId,
    })
    .returning({ id: proyectosMinerosTable.id });
  tempProyectoId = proyecto.id;
});

afterAll(async () => {
  process.env.FILES_PATH = originalFilesPath;
  await db
    .delete(proyectosMinerosTable)
    .where(eq(proyectosMinerosTable.id, tempProyectoId))
    .catch(() => {});
  await db
    .delete(archivosTable)
    .where(eq(archivosTable.id, tempArchivoMapaId))
    .catch(() => {});
  await unlink(path.join(TEST_FILES_PATH, tempArchivoMapaId)).catch(() => {});
});

beforeEach(() => {
  vi.clearAllMocks();
});

const getUpdateData = (overrides: Record<string, unknown> = {}) => ({
  id: tempProyectoId,
  nombre: TEMP_NOMBRE,
  tipoId: tempTipoId,
  ubicacion: 'Ubicación actualizada',
  provinciaGeologica: 'Provincia actualizada',
  areaHectareas: 100,
  litologia: 'Litología actualizada',
  mineralizacion: 'Mineralización actualizada',
  mineralInteres: 'Plata',
  modeloGenetico: 'Modelo actualizado',
  accesos: 'Accesos actualizados',
  etapaId: tempEtapaId,
  propietario: 'Propietario actualizado',
  localidadesCercanas: 'Localidad actualizada',
  coordenadasGeograficas: { lat: -30, lng: -68.5 },
  msnm: 1600,
  convenioEmse: true,
  visible: true,
  ...overrides,
});

test('Actualizar proyecto minero sin sesión activa lanza error de autenticación', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: {} } as any);

  await expect(runTestServerFn(() => updateProyectoMineroFn({ data: getUpdateData() }))).rejects.toThrow(
    'Usuario no autenticado'
  );
});

test('Actualizar proyecto minero autenticado modifica campos sin cambiar el archivo', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: { usuarioId: testUserId } } as any);

  const result = await runTestServerFn(() => updateProyectoMineroFn({ data: getUpdateData() }));

  expect(result).toBeDefined();
  expect(result.id).toBe(tempProyectoId);
  expect(result.ubicacion).toBe('Ubicación actualizada');
  expect(result.areaHectareas).toBe(100);
});

test('Actualizar proyecto minero con nuevo archivo de mapa mantiene el mismo ID', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: { usuarioId: testUserId } } as any);

  const result = await runTestServerFn(() =>
    updateProyectoMineroFn({
      data: getUpdateData({
        nombre: `${TEMP_NOMBRE}-ok`,
        archivoMapa: {
          nombre: 'nuevo-mapa.png',
          tamaño: 100,
          mimeType: 'image/png',
          base64: PNG_1X1_BASE64,
        },
      }),
    })
  );

  expect(result).toBeDefined();
  expect(result.id).toBe(tempProyectoId);
  expect(result.nombre).toBe(`${TEMP_NOMBRE}-ok`);
});
