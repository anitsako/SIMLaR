import { expect, test } from 'vitest';
import { getRutasNacionalesFn } from './get-rutas-nacionales.fn';
import { runTestServerFn } from '@/tests/run-test-server-fn';

test('Obtención de capa de rutas nacionales devuelve un array con datos', async () => {
  const result = await runTestServerFn(() => getRutasNacionalesFn());
  expect(Array.isArray(result)).toBe(true);
  expect(result.length).toBeGreaterThan(0);
});

test('Obtención de capa de rutas nacionales devuelve los campos esperados', async () => {
  const result = await runTestServerFn(() => getRutasNacionalesFn());
  const item = result[0];
  expect(item).toHaveProperty('id');
  expect(item).toHaveProperty('nombre');
  expect(item).toHaveProperty('jurisdiccion');
  expect(item).toHaveProperty('clase');
  expect(item).toHaveProperty('geom');
});

test('Obtención de capa de rutas nacionales devuelve geometría GeoJSON válida', async () => {
  const result = await runTestServerFn(() => getRutasNacionalesFn());
  const geom = result[0].geom;
  expect(geom).toHaveProperty('type', 'MultiLineString');
  expect(geom).toHaveProperty('coordinates');
  expect(Array.isArray(geom.coordinates)).toBe(true);
});
