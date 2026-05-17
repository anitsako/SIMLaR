import { afterAll, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { updateUsuarioFn } from './update-usuario.fn';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { usuariosTable } from '@/db/schemas/usuarios.schema';
import { runTestServerFn } from '@/tests/run-test-server-fn';

// updateUsuarioFn es POST y llama a useAppSession(): el mock es necesario solo para
// inyectar el usuarioId de sesión. La DB se usa sin mock.
vi.mock('@/auth/use-app-session', () => ({ useAppSession: vi.fn() }));

const testUsername = process.env.TEST_USERNAME;

if (!testUsername) {
  throw new Error('Missing TEST_USERNAME environment variable');
}

// Sufijo numérico corto para mantener username ≤ 20 chars
const TEMP_USERNAME = `tu${String(Date.now()).slice(-7)}`;

let testUserId: number;
let tempUserId: number;

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

  const hashPassword = await bcrypt.hash('Password123!', 12);
  const [tempUser] = await db
    .insert(usuariosTable)
    .values({
      username: TEMP_USERNAME,
      hashPassword,
      apellido: 'Temp',
      nombre: 'Inicial',
      email: `${TEMP_USERNAME}@test.com`,
      activo: true,
      usuarioCreadorId: testUserId,
      usuarioModificadorId: testUserId,
    })
    .returning({ id: usuariosTable.id });

  tempUserId = tempUser.id;
});

afterAll(async () => {
  await db.delete(usuariosTable).where(eq(usuariosTable.username, TEMP_USERNAME));
});

beforeEach(() => {
  vi.clearAllMocks();
});

test('Actualizar usuario sin sesión activa lanza error de autenticación', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: {} } as any);

  await expect(
    runTestServerFn(() =>
      updateUsuarioFn({
        data: {
          id: tempUserId,
          username: TEMP_USERNAME,
          apellido: 'Temp',
          nombre: 'Modificado',
          email: `${TEMP_USERNAME}@test.com`,
          activo: true,
        },
      })
    )
  ).rejects.toThrow('Usuario no autenticado');
});

test('Actualizar usuario autenticado modifica los datos correctamente', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: { usuarioId: testUserId } } as any);

  const result = await runTestServerFn(() =>
    updateUsuarioFn({
      data: {
        id: tempUserId,
        username: TEMP_USERNAME,
        apellido: 'Temp',
        nombre: 'Modificado',
        email: `${TEMP_USERNAME}@test.com`,
        activo: true,
      },
    })
  );

  expect(result).toBeDefined();
  expect(result.nombre).toBe('Modificado');
  expect(result.username).toBe(TEMP_USERNAME);
});

test('Actualizar usuario inexistente lanza error', async () => {
  vi.mocked(useAppSession).mockResolvedValue({ data: { usuarioId: testUserId } } as any);

  await expect(
    runTestServerFn(() =>
      updateUsuarioFn({
        data: {
          id: 999999,
          username: 'no-existe',
          apellido: 'No',
          nombre: 'Existe',
          email: 'no@existe.com',
          activo: true,
        },
      })
    )
  ).rejects.toThrow('Usuario no encontrado');
});
