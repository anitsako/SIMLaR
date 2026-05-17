import { expect, test } from 'vitest';
import { getDiquesFn } from './get-diques.fn';
import { runTestServerFn } from '@/tests/run-test-server-fn';

test('Obtención de capa de diques devuelve un array con datos', async () => {
  const result = await runTestServerFn(() => getDiquesFn());
  expect(Array.isArray(result)).toBe(true);
  expect(result.length).toBeGreaterThan(0);
});

test('Obtención de capa de diques devuelve los campos esperados', async () => {
  const result = await runTestServerFn(() => getDiquesFn());
  const item = result[0];
  expect(item).toHaveProperty('id');
  expect(item).toHaveProperty('nombre');
  expect(item).toHaveProperty('superficie');
  expect(item).toHaveProperty('geom');
});

test('Obtención de capa de diques devuelve geometría GeoJSON válida', async () => {
  const result = await runTestServerFn(() => getDiquesFn());
  const geom = result[0].geom;
  expect(geom).toHaveProperty('type', 'MultiPolygon');
  expect(geom).toHaveProperty('coordinates');
  expect(Array.isArray(geom.coordinates)).toBe(true);
});
