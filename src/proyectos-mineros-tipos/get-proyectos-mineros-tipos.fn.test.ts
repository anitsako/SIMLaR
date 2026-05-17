import { expect, test } from 'vitest';
import { getProyectosMinerosTiposFn } from './get-proyectos-mineros-tipos.fn';
import { runTestServerFn } from '@/tests/run-test-server-fn';

test('Obtención de tipos de proyectos mineros devuelve un array', async () => {
  const result = await runTestServerFn(() => getProyectosMinerosTiposFn());

  expect(Array.isArray(result)).toBe(true);
});

test('Obtención de tipos de proyectos mineros devuelve los campos esperados', async () => {
  const result = await runTestServerFn(() => getProyectosMinerosTiposFn());

  if (result.length > 0) {
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('nombre');
    expect(result[0]).toHaveProperty('forma');
  }
});

test('Obtención de tipos de proyectos mineros devuelve resultados ordenados por nombre', async () => {
  const result = await runTestServerFn(() => getProyectosMinerosTiposFn());
  const nombres = result.map((tipo) => tipo.nombre);
  const sorted = [...nombres].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  expect(nombres).toEqual(sorted);
});
