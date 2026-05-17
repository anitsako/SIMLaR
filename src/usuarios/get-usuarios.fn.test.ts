import { expect, test } from 'vitest';
import { getUsuariosFn } from './get-usuarios.fn';
import { runTestServerFn } from '@/tests/run-test-server-fn';

test('Obtención de lista de usuarios devuelve al menos un usuario', async () => {
  const result = await runTestServerFn(() => getUsuariosFn());
  expect(result).toBeDefined();
  expect(result.length).toBeGreaterThan(0);
});

test('Obtención de lista de usuarios devuelve los campos esperados', async () => {
  const result = await runTestServerFn(() => getUsuariosFn());
  const first = result[0];
  expect(first).toHaveProperty('id');
  expect(first).toHaveProperty('username');
  expect(first).toHaveProperty('apellido');
  expect(first).toHaveProperty('nombre');
  expect(first).toHaveProperty('email');
});

test('Obtención de lista de usuarios devuelve resultados ordenados por apellido', async () => {
  const result = await runTestServerFn(() => getUsuariosFn());
  const apellidos = result.map((u) => u.apellido);
  // PostgreSQL ordena con collation C (orden ASCII: mayúsculas antes que minúsculas)
  const sorted = [...apellidos].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  expect(apellidos).toEqual(sorted);
});
