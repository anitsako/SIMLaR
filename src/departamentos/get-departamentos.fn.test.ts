import { expect, test } from 'vitest';
import { getDepartamentosFn } from './get-departamentos.fn';
import { runTestServerFn } from '@/tests/run-test-server-fn';

test('Obtención de capa de departamentos devuelve un array con datos', async () => {
  const result = await runTestServerFn(() => getDepartamentosFn());
  expect(Array.isArray(result)).toBe(true);
  expect(result.length).toBeGreaterThan(0);
});

test('Obtención de capa de departamentos devuelve los campos esperados', async () => {
  const result = await runTestServerFn(() => getDepartamentosFn());
  const item = result[0];
  expect(item).toHaveProperty('id');
  expect(item).toHaveProperty('nombre');
  expect(item).toHaveProperty('geom');
});

test('Obtención de capa de departamentos devuelve geometría GeoJSON válida', async () => {
  const result = await runTestServerFn(() => getDepartamentosFn());
  const geom = result[0].geom;
  expect(geom).toHaveProperty('type', 'MultiPolygon');
  expect(geom).toHaveProperty('coordinates');
  expect(Array.isArray(geom.coordinates)).toBe(true);
});
