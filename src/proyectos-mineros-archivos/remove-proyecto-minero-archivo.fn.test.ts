import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import { and, eq, sql } from 'drizzle-orm';
import { removeProyectoMineroArchivoFn } from './remove-proyecto-minero-archivo.fn';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { proyectosMinerosTable } from '@/db/schemas/proyectos-mineros.schema';
import { proyectosMinerosArchivosTable } from '@/db/schemas/proyectos-mineros-archivos.schema';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { proyectosMinerosEtapasTable } from '@/db/schemas/proyectos-mineros-etapas.schema';
import { proyectosMinerosTiposTable } from '@/db/schemas/proyectos-mineros-tipos.schema';
import { usuariosTable } from '@/db/schemas/usuarios.schema';
import { runTestServerFn } from '@/tests/run-test-server-fn';

vi.mock('@/auth/use-app-session', () => ({ useAppSession: vi.fn() }));

const testUsername = process.env.TEST_USERNAME;
if (!testUsername) throw new Error('Missing TEST_USERNAME environment variable');

const TEMP_NOMBRE = `tmp-rpma-${String(Date.now()).slice(-7)}`;
const TEST_FILES_PATH = path.join(process.cwd(), '.test-files');
const originalFilesPath = process.env.FILES_PATH;

let testUserId: number;
let tempTipoId: number;
let tempEtapaId: number;
let tempProyectoId: number;
let tempArchivoMapaId: string;
let tempExtraArchivoId: string;

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
      ubicacion: 'Ubicación temporal',
      provinciaGeologica: 'Provincia temporal',
      area: '100ha',
      litologia: 'Litología temporal',
      mineralizacion: 'Mineralización temporal',
      mineralInteres: 'Plomo',
      modeloGenetico: 'Modelo temporal',
      accesos: 'Accesos temporales',
      etapaId: tempEtapaId,
      propietario: 'Propietario temporal',
      localidadesCercanas: 'Localidad temporal',
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

  const [extraArchivo] = await db
    .insert(archivosTable)
    .values({
      nombre: `${TEMP_NOMBRE}-extra.pdf`,
      tamaño: 200,
      mimeType: 'application/pdf',
      usuarioCreadorId: testUserId,
      usuarioModificadorId: testUserId,
    })
    .returning({ id: archivosTable.id });
  tempExtraArchivoId = extraArchivo.id;

  await db.insert(proyectosMinerosArchivosTable).values({
    proyectoMineroId: tempProyectoId,
    archivoId: tempExtraArchivoId,
    usuarioCreadorId: testUserId,
  });
});

afterAll(async () => {
  process.env.FILES_PATH = originalFilesPath;
  await db
    .delete(proyectosMinerosArchivosTable)
    .where(
      and(
        eq(proyectosMinerosArchivosTable.proyectoMineroId, tempProyectoId),
        eq(proyectosMinerosArchivosTable.archivoId, tempExtraArchivoId)
      )
    )
    .catch(() => {});
  await db
    .delete(proyectosMinerosTable)
    .where(eq(proyectosMinerosTable.id, tempProyectoId))
    .catch(() => {});
  await db
    .delete(archivosTable)
    .where(eq(archivosTable.id, tempExtraArchivoId))
    .catch(() => {});
  await db
    .delete(archivosTable)
    .where(eq(archivosTable.id, tempArchivoMapaId))
    .catch(() => {});
  await unlink(path.join(TEST_FILES_PATH, tempExtraArchivoId)).catch(() => {});
  await unlink(path.join(TEST_FILES_PATH, tempArchivoMapaId)).catch(() => {});
});

beforeEach(() => {
  vi.clearAllMocks();
});

test('Eliminar archivo de proyecto minero sin sesión activa lanza error de autenticación', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: {} } as any);

  await expect(
    runTestServerFn(() =>
      removeProyectoMineroArchivoFn({ data: { proyectoMineroId: tempProyectoId, archivoId: tempExtraArchivoId } })
    )
  ).rejects.toThrow('Usuario no autenticado');
});

test('Eliminar archivo existente de proyecto minero lo borra de la base de datos', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: { usuarioId: testUserId } } as any);

  const result = await runTestServerFn(() =>
    removeProyectoMineroArchivoFn({ data: { proyectoMineroId: tempProyectoId, archivoId: tempExtraArchivoId } })
  );

  expect(result).toEqual({ archivoId: tempExtraArchivoId });

  const relaciones = await db
    .select()
    .from(proyectosMinerosArchivosTable)
    .where(
      and(
        eq(proyectosMinerosArchivosTable.proyectoMineroId, tempProyectoId),
        eq(proyectosMinerosArchivosTable.archivoId, tempExtraArchivoId)
      )
    );
  expect(relaciones).toHaveLength(0);

  const archivos = await db.select().from(archivosTable).where(eq(archivosTable.id, tempExtraArchivoId));
  expect(archivos).toHaveLength(0);
});

test('Eliminar archivo ya removido de proyecto minero sigue siendo idempotente', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: { usuarioId: testUserId } } as any);

  const result = await runTestServerFn(() =>
    removeProyectoMineroArchivoFn({ data: { proyectoMineroId: tempProyectoId, archivoId: tempExtraArchivoId } })
  );

  expect(result).toEqual({ archivoId: tempExtraArchivoId });
});
