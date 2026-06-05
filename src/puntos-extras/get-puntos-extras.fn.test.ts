import { expect, test } from 'vitest';
import { getPuntosExtrasFn } from './get-puntos-extras.fn';
import { runTestServerFn } from '@/tests/run-test-server-fn';

test('Obtención de capa de puntos extras devuelve un array con datos', async () => {
  const result = await runTestServerFn(() => getPuntosExtrasFn());
  expect(Array.isArray(result)).toBe(true);
  expect(result.length).toBeGreaterThan(0);
});

test('Obtención de capa de puntos extras devuelve los campos esperados', async () => {
  const result = await runTestServerFn(() => getPuntosExtrasFn());
  const item = result[0];
  expect(item).toHaveProperty('id');
  expect(item).toHaveProperty('nombre');
  expect(item).toHaveProperty('tipo');
  expect(item).toHaveProperty('geom');
});

test('Obtención de capa de puntos extras devuelve geometría GeoJSON válida', async () => {
  const result = await runTestServerFn(() => getPuntosExtrasFn());
  const geom = result[0].geom;
  expect(geom).toHaveProperty('type', 'Point');
  expect(geom).toHaveProperty('coordinates');
  expect(Array.isArray(geom.coordinates)).toBe(true);
});
