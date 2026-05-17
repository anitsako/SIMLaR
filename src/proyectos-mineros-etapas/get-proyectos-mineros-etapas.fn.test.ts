import { expect, test } from 'vitest';
import { getProyectosMinerosEtapasFn } from './get-proyectos-mineros-etapas.fn';
import { runTestServerFn } from '@/tests/run-test-server-fn';

test('Obtención de etapas de proyectos mineros devuelve un array', async () => {
  const result = await runTestServerFn(() => getProyectosMinerosEtapasFn());

  expect(Array.isArray(result)).toBe(true);
});

test('Obtención de etapas de proyectos mineros devuelve los campos esperados', async () => {
  const result = await runTestServerFn(() => getProyectosMinerosEtapasFn());

  if (result.length > 0) {
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('nombre');
    expect(result[0]).toHaveProperty('color');
  }
});

test('Obtención de etapas de proyectos mineros devuelve resultados ordenados por nombre', async () => {
  const result = await runTestServerFn(() => getProyectosMinerosEtapasFn());
  const nombres = result.map((etapa) => etapa.nombre);
  const sorted = [...nombres].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  expect(nombres).toEqual(sorted);
});
