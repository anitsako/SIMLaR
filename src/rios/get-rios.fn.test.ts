import { expect, test } from 'vitest';
import { getRiosFn } from './get-rios.fn';
import { runTestServerFn } from '@/tests/run-test-server-fn';

test('Obtención de capa de rios devuelve un array con datos', async () => {
  const result = await runTestServerFn(() => getRiosFn());
  expect(Array.isArray(result)).toBe(true);
  expect(result.length).toBeGreaterThan(0);
});

test('Obtención de capa de rios devuelve los campos esperados', async () => {
  const result = await runTestServerFn(() => getRiosFn());
  const item = result[0];
  expect(item).toHaveProperty('id');
  expect(item).toHaveProperty('nombre');
  expect(item).toHaveProperty('distancia');
  expect(item).toHaveProperty('geom');
});

test('Obtención de capa de rios devuelve geometría GeoJSON válida', async () => {
  const result = await runTestServerFn(() => getRiosFn());
  const geom = result[0].geom;
  expect(geom).toHaveProperty('type', 'MultiLineString');
  expect(geom).toHaveProperty('coordinates');
  expect(Array.isArray(geom.coordinates)).toBe(true);
});
