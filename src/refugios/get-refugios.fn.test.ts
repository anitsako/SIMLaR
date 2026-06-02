import { expect, test } from 'vitest';
import { getRefugiosFn } from './get-refugios.fn';
import { runTestServerFn } from '@/tests/run-test-server-fn';

test('Obtención de capa de refugios devuelve un array con datos', async () => {
  const result = await runTestServerFn(() => getRefugiosFn());
  expect(Array.isArray(result)).toBe(true);
  expect(result.length).toBeGreaterThan(0);
});

test('Obtención de capa de refugios devuelve los campos esperados', async () => {
  const result = await runTestServerFn(() => getRefugiosFn());
  const item = result[0];
  expect(item).toHaveProperty('id');
  expect(item).toHaveProperty('nombre');
  expect(item).toHaveProperty('tipo');
  expect(item).toHaveProperty('geom');
});

test('Obtención de capa de refugios devuelve geometría GeoJSON válida', async () => {
  const result = await runTestServerFn(() => getRefugiosFn());
  const geom = result[0].geom;
  expect(geom).toHaveProperty('type', 'Point');
  expect(geom).toHaveProperty('coordinates');
  expect(Array.isArray(geom.coordinates)).toBe(true);
});
