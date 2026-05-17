import { afterAll, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import { eq } from 'drizzle-orm';
import { updateImagenCarrouselFn } from './update-imagen-carrousel.fn';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { archivosTable } from '@/db/schemas/archivos.schema';
import { carrouselImagenesTable } from '@/db/schemas/carrousel-imagenes.schema';
import { usuariosTable } from '@/db/schemas/usuarios.schema';
import { runTestServerFn } from '@/tests/run-test-server-fn';

// updateImagenCarrouselFn es POST y llama a useAppSession(): se mockea solo para inyectar
// el usuarioId. La DB se usa sin mock; no hay operaciones de sistema de archivos.
vi.mock('@/auth/use-app-session', () => ({ useAppSession: vi.fn() }));

const testUsername = process.env.TEST_USERNAME;
if (!testUsername) throw new Error('Missing TEST_USERNAME environment variable');

let testUserId: number;
let tempArchivoId1: string;
let tempArchivoId2: string;

beforeAll(async () => {
  const usuarios = await db
    .select({ id: usuariosTable.id })
    .from(usuariosTable)
    .where(eq(usuariosTable.username, testUsername));

  if (usuarios.length === 0) {
    throw new Error(`Usuario de prueba '${testUsername}' no encontrado`);
  }

  const usuario = usuarios[0];
  testUserId = usuario.id;

  // Insertar 2 archivos + 2 imágenes del carrusel con ordenes consecutivos para probar move
  const [a1] = await db
    .insert(archivosTable)
    .values({
      nombre: 'temp-update-1.png',
      tamaño: 100,
      mimeType: 'image/png',
      usuarioCreadorId: testUserId,
      usuarioModificadorId: testUserId,
    })
    .returning({ id: archivosTable.id });

  const [a2] = await db
    .insert(archivosTable)
    .values({
      nombre: 'temp-update-2.png',
      tamaño: 100,
      mimeType: 'image/png',
      usuarioCreadorId: testUserId,
      usuarioModificadorId: testUserId,
    })
    .returning({ id: archivosTable.id });

  tempArchivoId1 = a1.id;
  tempArchivoId2 = a2.id;

  await db.insert(carrouselImagenesTable).values([
    {
      archivoId: tempArchivoId1,
      positionY: 50,
      orden: 900,
      usuarioCreadorId: testUserId,
      usuarioModificadorId: testUserId,
    },
    {
      archivoId: tempArchivoId2,
      positionY: 50,
      orden: 901,
      usuarioCreadorId: testUserId,
      usuarioModificadorId: testUserId,
    },
  ]);
});

afterAll(async () => {
  await db
    .delete(carrouselImagenesTable)
    .where(eq(carrouselImagenesTable.archivoId, tempArchivoId1))
    .catch(() => {});
  await db
    .delete(carrouselImagenesTable)
    .where(eq(carrouselImagenesTable.archivoId, tempArchivoId2))
    .catch(() => {});
  await db
    .delete(archivosTable)
    .where(eq(archivosTable.id, tempArchivoId1))
    .catch(() => {});
  await db
    .delete(archivosTable)
    .where(eq(archivosTable.id, tempArchivoId2))
    .catch(() => {});
});

beforeEach(() => {
  vi.clearAllMocks();
});

test('Actualizar imagen sin sesión activa lanza error de autenticación', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: {} } as any);

  await expect(
    runTestServerFn(() => updateImagenCarrouselFn({ data: { archivoId: tempArchivoId1, positionY: 30 } }))
  ).rejects.toThrow('Usuario no autenticado');
});

test('Actualizar positionY de imagen existente devuelve imagen actualizada', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: { usuarioId: testUserId } } as any);

  const result = await runTestServerFn(() =>
    updateImagenCarrouselFn({ data: { archivoId: tempArchivoId1, positionY: 75 } })
  );

  expect(result).toBeDefined();
  expect(result.archivoId).toBe(tempArchivoId1);
  expect(result.positionY).toBe(75);
});

test('Mover imagen hacia arriba intercambia el orden con su vecino', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: { usuarioId: testUserId } } as any);

  const [before1] = await db
    .select({ orden: carrouselImagenesTable.orden })
    .from(carrouselImagenesTable)
    .where(eq(carrouselImagenesTable.archivoId, tempArchivoId1));
  const [before2] = await db
    .select({ orden: carrouselImagenesTable.orden })
    .from(carrouselImagenesTable)
    .where(eq(carrouselImagenesTable.archivoId, tempArchivoId2));

  // tempArchivoId2 tiene orden mayor; moverla 'up' debería intercambiar con tempArchivoId1
  await runTestServerFn(() => updateImagenCarrouselFn({ data: { archivoId: tempArchivoId2, move: 'up' } }));

  const [after1] = await db
    .select({ orden: carrouselImagenesTable.orden })
    .from(carrouselImagenesTable)
    .where(eq(carrouselImagenesTable.archivoId, tempArchivoId1));
  const [after2] = await db
    .select({ orden: carrouselImagenesTable.orden })
    .from(carrouselImagenesTable)
    .where(eq(carrouselImagenesTable.archivoId, tempArchivoId2));

  expect(after1.orden).toBe(before2.orden);
  expect(after2.orden).toBe(before1.orden);
});

test('Actualizar imagen inexistente lanza error', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: { usuarioId: testUserId } } as any);

  const fakeId = crypto.randomUUID();
  await expect(
    runTestServerFn(() => updateImagenCarrouselFn({ data: { archivoId: fakeId, positionY: 50 } }))
  ).rejects.toThrow('Imagen de carrusel no encontrada');
});
