import { beforeAll, expect, test } from 'vitest';
import { eq } from 'drizzle-orm';
import { getUsuarioFn } from './get-usuario.fn';
import { db } from '@/db';
import { usuariosTable } from '@/db/schemas/usuarios.schema';
import { runTestServerFn } from '@/tests/run-test-server-fn';

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

  const usuario = usuarios[0];
  testUserId = usuario.id;
});

test('Obtención de usuario por ID válido retorna el usuario', async () => {
  const result = await runTestServerFn(() => getUsuarioFn({ data: { id: testUserId } }));
  expect(result).toBeDefined();
  expect(result.username).toBe(testUsername);
});

test('Obtención de usuario por ID válido devuelve los campos esperados', async () => {
  const result = await runTestServerFn(() => getUsuarioFn({ data: { id: testUserId } }));
  expect(result).toHaveProperty('id');
  expect(result).toHaveProperty('username');
  expect(result).toHaveProperty('apellido');
  expect(result).toHaveProperty('nombre');
  expect(result).toHaveProperty('email');
  expect(result).toHaveProperty('activo');
});

test('Obtención de usuario por ID inexistente devuelve null', async () => {
  const result = await runTestServerFn(() => getUsuarioFn({ data: { id: 999999 } }));
  expect(result).toBeNull();
});
