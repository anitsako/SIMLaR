import os from 'node:os';
import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import { eq } from 'drizzle-orm';
import { addImagenCarrouselFn } from './add-imagen-carrousel.fn';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { carrouselImagenesTable } from '@/db/schemas/carrousel-imagenes.schema';
import { usuariosTable } from '@/db/schemas/usuarios.schema';
import { runTestServerFn } from '@/tests/run-test-server-fn';

// addImagenCarrouselFn es POST y llama a useAppSession(): se mockea solo para inyectar
// el usuarioId. La DB, el sistema de archivos y detectImageMime se usan sin mock.
vi.mock('@/auth/use-app-session', () => ({ useAppSession: vi.fn() }));

const testUsername = process.env.TEST_USERNAME;
if (!testUsername) throw new Error('Missing TEST_USERNAME environment variable');

// PNG 1x1 píxel válido en base64 (pasa el chequeo de magic bytes de detectImageMime)
const PNG_1X1_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQAABjE+ibYAAAAASUVORK5CYII=';

let testUserId: number;
let addedArchivoId: string | undefined;
const originalFilesPath = process.env.FILES_PATH;

beforeAll(async () => {
  // Usar directorio temporal del SO para no contaminar ./archivos del proyecto
  process.env.FILES_PATH = os.tmpdir();

  const usuarios = await db
    .select({ id: usuariosTable.id })
    .from(usuariosTable)
    .where(eq(usuariosTable.username, testUsername));

  if (usuarios.length === 0) {
    throw new Error(`Usuario de prueba '${testUsername}' no encontrado`);
  }

  const usuario = usuarios[0];
  testUserId = usuario.id;
});

afterAll(async () => {
  process.env.FILES_PATH = originalFilesPath;

  if (addedArchivoId) {
    await db
      .delete(carrouselImagenesTable)
      .where(eq(carrouselImagenesTable.archivoId, addedArchivoId))
      .catch(() => {});
    await db
      .delete(archivosTable)
      .where(eq(archivosTable.id, addedArchivoId))
      .catch(() => {});
    await unlink(path.join(os.tmpdir(), addedArchivoId)).catch(() => {});
  }
});

beforeEach(() => {
  vi.clearAllMocks();
});

const archivoData = {
  nombre: 'test-imagen.png',
  tamaño: 100,
  mimeType: 'image/png',
  base64: PNG_1X1_BASE64,
};

test('Agregar imagen sin sesión activa lanza error de autenticación', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: {} } as any);

  await expect(runTestServerFn(() => addImagenCarrouselFn({ data: { archivo: archivoData } }))).rejects.toThrow(
    'Usuario no autenticado'
  );
});

test('Agregar imagen autenticada inserta registro en base de datos', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: { usuarioId: testUserId } } as any);

  const result = await runTestServerFn(() => addImagenCarrouselFn({ data: { archivo: archivoData } }));

  expect(result).toBeDefined();
  expect(result.archivoId).toBeDefined();
  expect(result.nombre).toBe('test-imagen.png');
  expect(result.mimeType).toBe('image/png');
  expect(typeof result.orden).toBe('number');

  addedArchivoId = result.archivoId;
});

test('Agregar imagen con datos no válidos lanza error de tipo de archivo', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: { usuarioId: testUserId } } as any);

  const archivoInvalido = {
    ...archivoData,
    base64: Buffer.from('no es una imagen').toString('base64'),
  };

  await expect(runTestServerFn(() => addImagenCarrouselFn({ data: { archivo: archivoInvalido } }))).rejects.toThrow(
    'Archivo no es una imagen válida'
  );
});
