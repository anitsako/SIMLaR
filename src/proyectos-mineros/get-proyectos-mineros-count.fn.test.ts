import { expect, test } from 'vitest';
import { getProyectosMinerosCountFn } from './get-proyectos-mineros-count.fn';
import { runTestServerFn } from '@/tests/run-test-server-fn';

test('Conteo de proyectos mineros sin filtros devuelve un número válido', async () => {
  const result = await runTestServerFn(() => getProyectosMinerosCountFn({ data: {} }));

  expect(typeof result).toBe('number');
  expect(result).toBeGreaterThanOrEqual(0);
});

test('Conteo de proyectos mineros con visible=true devuelve un número válido', async () => {
  const result = await runTestServerFn(() => getProyectosMinerosCountFn({ data: { visible: true } }));

  expect(typeof result).toBe('number');
  expect(result).toBeGreaterThanOrEqual(0);
});

test("Conteo de proyectos mineros con nombre inexistente devuelve 0", async () => {
  const result = await runTestServerFn(() =>
    getProyectosMinerosCountFn({ data: { nombreLike: 'zzz_no_existe_xyz' } })
  );

  expect(result).toBe(0);
});
