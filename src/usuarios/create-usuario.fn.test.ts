import { afterAll, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import { eq } from 'drizzle-orm';
import { createUsuarioFn } from './create-usuario.fn';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { usuariosTable } from '@/db/schemas/usuarios.schema';
import { runTestServerFn } from '@/tests/run-test-server-fn';

// createUsuarioFn es POST y llama a useAppSession(): el mock es necesario solo para
// inyectar el usuarioId de sesión. La DB y bcrypt se usan sin mock.
vi.mock('@/auth/use-app-session', () => ({ useAppSession: vi.fn() }));

const testUsername = process.env.TEST_USERNAME;

if (!testUsername) {
  throw new Error('Missing TEST_USERNAME environment variable');
}

// Sufijo numérico corto para mantener username ≤ 20 chars
const TEMP_USERNAME = `tc${String(Date.now()).slice(-7)}`;

let testUserId: number;

beforeAll(async () => {
  const usuarios = await db
    .select({ id: usuariosTable.id })
    .from(usuariosTable)
    .where(eq(usuariosTable.username, testUsername));

  if (usuarios.length === 0) {
    throw new Error(`Usuario de prueba '${testUsername}' no encontrado en la base de datos`);
  }

  const usuario = usuarios[0];
  testUserId = usuario.id;
});

afterAll(async () => {
  await db.delete(usuariosTable).where(eq(usuariosTable.username, TEMP_USERNAME));
});

beforeEach(() => {
  vi.clearAllMocks();
});

const nuevoUsuarioData = {
  username: TEMP_USERNAME,
  password: 'Password123!',
  apellido: 'Test',
  nombre: 'Temporal',
  email: `${TEMP_USERNAME}@test.com`,
  activo: true as const,
};

test('Crear usuario sin sesión activa lanza error de autenticación', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: {} } as any);

  await expect(runTestServerFn(() => createUsuarioFn({ data: nuevoUsuarioData }))).rejects.toThrow(
    'Usuario no autenticado'
  );
});

test('Crear usuario autenticado inserta el usuario en la base de datos', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: { usuarioId: testUserId } } as any);

  const result = await runTestServerFn(() => createUsuarioFn({ data: nuevoUsuarioData }));

  expect(result).toBeDefined();
  expect(result[0].username).toBe(TEMP_USERNAME);
  expect(result[0].apellido).toBe('Test');
  expect(result[0].nombre).toBe('Temporal');
});

test('Crear usuario duplicado lanza error', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: { usuarioId: testUserId } } as any);

  await expect(runTestServerFn(() => createUsuarioFn({ data: nuevoUsuarioData }))).rejects.toThrow(
    'Error creando el usuario'
  );
});
