import { expect, test } from 'vitest';
import { loginFn } from './login.fn';
import { runTestServerFn } from '@/tests/run-test-server-fn';

const testUsername = process.env.TEST_USERNAME;
const testPassword = process.env.TEST_PASSWORD;

if (!testUsername || !testPassword) {
  throw new Error('Missing TEST_USERNAME or TEST_PASSWORD environment variables');
}

test('Login con TEST_USERNAME y TEST_PASSWORD válidos crea sesión y redirige', async () => {
  await expect(
    runTestServerFn(() => loginFn({ data: { username: testUsername, password: testPassword } }))
  ).rejects.toBeDefined();
});

test('Login con contraseña incorrecta devuelve error', async () => {
  const result = await runTestServerFn(() =>
    loginFn({ data: { username: testUsername, password: `${testPassword}-incorrecto` } })
  );
  expect(result).toEqual({ error: 'Credenciales inválidas' });
});

test('Login con usuario inexistente devuelve error', async () => {
  const result = await runTestServerFn(() =>
    loginFn({ data: { username: `${testUsername}-noexiste`, password: testPassword } })
  );
  expect(result).toEqual({ error: 'Credenciales inválidas' });
});
