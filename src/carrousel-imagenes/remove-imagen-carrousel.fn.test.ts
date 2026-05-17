import os from 'node:os';
import { afterAll, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import { eq } from 'drizzle-orm';
import { removeImagenCarrouselFn } from './remove-imagen-carrousel.fn';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { carrouselImagenesTable } from '@/db/schemas/carrousel-imagenes.schema';
import { usuariosTable } from '@/db/schemas/usuarios.schema';
import { runTestServerFn } from '@/tests/run-test-server-fn';

// removeImagenCarrouselFn es POST y llama a useAppSession(): se mockea solo para inyectar
// el usuarioId. La DB se usa sin mock; la función maneja ENOENT del archivo graciosamente.
vi.mock('@/auth/use-app-session', () => ({ useAppSession: vi.fn() }));

const testUsername = process.env.TEST_USERNAME;
if (!testUsername) throw new Error('Missing TEST_USERNAME environment variable');

let testUserId: number;
let tempArchivoId: string;
const originalFilesPath = process.env.FILES_PATH;

beforeAll(async () => {
  // La función de remove intenta unlink pero tolera ENOENT: no hace falta crear el archivo.
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

  // Insertar archivo y carrouselImagen directamente en la DB (sin pasar por addImagenCarrouselFn)
  const [archivo] = await db
    .insert(archivosTable)
    .values({
      nombre: 'temp-remove-test.png',
      tamaño: 100,
      mimeType: 'image/png',
      usuarioCreadorId: testUserId,
      usuarioModificadorId: testUserId,
    })
    .returning({ id: archivosTable.id });

  tempArchivoId = archivo.id;

  await db.insert(carrouselImagenesTable).values({
    archivoId: tempArchivoId,
    positionY: 50,
    orden: 999,
    usuarioCreadorId: testUserId,
    usuarioModificadorId: testUserId,
  });
});

afterAll(async () => {
  process.env.FILES_PATH = originalFilesPath;
  // Limpieza en caso de que el test de eliminación haya fallado
  await db
    .delete(carrouselImagenesTable)
    .where(eq(carrouselImagenesTable.archivoId, tempArchivoId))
    .catch(() => {});
  await db
    .delete(archivosTable)
    .where(eq(archivosTable.id, tempArchivoId))
    .catch(() => {});
});

beforeEach(() => {
  vi.clearAllMocks();
});

test('Eliminar imagen sin sesión activa lanza error de autenticación', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: {} } as any);

  await expect(runTestServerFn(() => removeImagenCarrouselFn({ data: { archivoId: tempArchivoId } }))).rejects.toThrow(
    'Usuario no autenticado'
  );
});

test('Eliminar imagen existente la borra de la base de datos', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: { usuarioId: testUserId } } as any);

  const result = await runTestServerFn(() => removeImagenCarrouselFn({ data: { archivoId: tempArchivoId } }));

  expect(result).toBeDefined();
  expect(result.archivoId).toBe(tempArchivoId);

  const remaining = await db
    .select()
    .from(carrouselImagenesTable)
    .where(eq(carrouselImagenesTable.archivoId, tempArchivoId));
  expect(remaining).toHaveLength(0);
});

test('Eliminar imagen inexistente lanza error', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: { usuarioId: testUserId } } as any);

  const fakeId = crypto.randomUUID();
  await expect(runTestServerFn(() => removeImagenCarrouselFn({ data: { archivoId: fakeId } }))).rejects.toThrow(
    'Imagen de carrusel no encontrada'
  );
});
