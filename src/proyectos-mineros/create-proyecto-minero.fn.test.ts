import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import { eq } from 'drizzle-orm';
import { createProyectoMineroFn } from './create-proyecto-minero.fn';
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
const TEMP_NOMBRE = `tmp-cpm-${String(Date.now()).slice(-7)}`;
const TEST_FILES_PATH = path.join(process.cwd(), '.test-files');
const originalFilesPath = process.env.FILES_PATH;

let testUserId: number;
let tempTipoId: number;
let tempEtapaId: number;
let createdProyectoId: number | undefined;
let createdArchivoMapaId: string | undefined;

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
});

afterAll(async () => {
  process.env.FILES_PATH = originalFilesPath;

  if (createdProyectoId !== undefined) {
    await db
      .delete(proyectosMinerosTable)
      .where(eq(proyectosMinerosTable.id, createdProyectoId))
      .catch(() => {});
  }

  if (createdArchivoMapaId) {
    await db
      .delete(archivosTable)
      .where(eq(archivosTable.id, createdArchivoMapaId))
      .catch(() => {});
    await unlink(path.join(TEST_FILES_PATH, createdArchivoMapaId)).catch(() => {});
  }
});

beforeEach(() => {
  vi.clearAllMocks();
});

const getProyectoData = (overrides: Record<string, unknown> = {}) => ({
  nombre: TEMP_NOMBRE,
  tipoId: tempTipoId,
  ubicacion: 'Test Ubicación',
  provinciaGeologica: 'Test Provincia',
  area: '100ha',
  litologia: 'Test litología',
  mineralizacion: 'Test mineralización',
  mineralInteres: 'Oro',
  modeloGenetico: 'Test modelo',
  accesos: 'Test accesos',
  etapaId: tempEtapaId,
  propietario: 'Test Propietario',
  localidadesCercanas: 'Test Localidades',
  coordenadasGeograficas: { lat: -30, lng: -68.5 },
  msnm: 1500,
  convenioEmse: false,
  visible: true,
  archivoMapa: {
    nombre: 'mapa.png',
    tamaño: 100,
    mimeType: 'image/png',
    base64: PNG_1X1_BASE64,
  },
  ...overrides,
});

test('Crear proyecto minero sin sesión activa lanza error de autenticación', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: {} } as any);

  await expect(runTestServerFn(() => createProyectoMineroFn({ data: getProyectoData() }))).rejects.toThrow(
    'Usuario no autenticado'
  );
});

test('Crear proyecto minero autenticado inserta el proyecto en la base de datos', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: { usuarioId: testUserId } } as any);

  const result = await runTestServerFn(() => createProyectoMineroFn({ data: getProyectoData() }));

  createdProyectoId = result.id;
  createdArchivoMapaId = result.archivoMapaId;

  expect(result).toBeDefined();
  expect(result.id).toBeDefined();
  expect(result.nombre).toBe(TEMP_NOMBRE);
});

test('Crear proyecto minero con imagen inválida lanza error', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: { usuarioId: testUserId } } as any);

  await expect(
    runTestServerFn(() =>
      createProyectoMineroFn({
        data: getProyectoData({
          nombre: `${TEMP_NOMBRE}-inv`,
          archivoMapa: {
            nombre: 'mapa.txt',
            tamaño: 10,
            mimeType: 'text/plain',
            base64: Buffer.from('no es una imagen').toString('base64'),
          },
        }),
      })
    )
  ).rejects.toThrow('Archivo no es una imagen válida (JPG, PNG o WEBP)');
});
