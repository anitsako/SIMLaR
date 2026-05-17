import { beforeAll, beforeEach, expect, test, vi } from 'vitest';
import { eq } from 'drizzle-orm';
import { getCurrentUserFn } from './get-current-user.fn';
import { useAppSession } from './use-app-session';
import { db } from '@/db';
import { usuariosTable } from '@/db/schemas/usuarios.schema';
import { runTestServerFn } from '@/tests/run-test-server-fn';

// useAppSession requiere un H3 event que solo está disponible en funciones POST.
// getCurrentUserFn es GET (usa createSsrRpc), por lo que useAppSession debe mockearse.
// La consulta a la base de datos es real.
vi.mock('./use-app-session', () => ({ useAppSession: vi.fn() }));

const testUsername = process.env.TEST_USERNAME;

if (!testUsername) {
  throw new Error('Missing TEST_USERNAME environment variable');
}

let testUserId: number;

beforeAll(async () => {
  const usuarios = await db
    .select({ id: usuariosTable.id })
    .from(usuariosTable)
    .where(eq(usuariosTable.username, testUsername));

  if (usuarios.length === 0) {
    throw new Error(`Usuario de prueba '${testUsername}' no encontrado en la base de datos`);
  }
  testUserId = usuarios[0].id;
});

beforeEach(() => {
  vi.clearAllMocks();
});

test('Obtención de usuario actual sin sesión devuelve null', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: {}, clear: vi.fn() } as any);
  const result = await runTestServerFn(() => getCurrentUserFn());
  expect(result).toBeNull();
});

test('Obtención de usuario actual con sesión válida retorna el usuario', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: { usuarioId: testUserId }, clear: vi.fn() } as any);
  const result = await runTestServerFn(() => getCurrentUserFn());
  expect(result).toBeDefined();
  expect(result?.username).toBe(testUsername);
});
