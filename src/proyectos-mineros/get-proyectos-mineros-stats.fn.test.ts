import { expect, test } from 'vitest';

import { getProyectosMinerosStatsFn } from './get-proyectos-mineros-stats.fn';
import { runTestServerFn } from '@/tests/run-test-server-fn';

test('Las estadísticas de proyectos mineros tienen la estructura esperada', async () => {
  const result = await runTestServerFn(() =>
    getProyectosMinerosStatsFn({ data: {} })
  );

  expect(typeof result.totalProyectos).toBe('number');
  expect(result.totalProyectos).toBeGreaterThanOrEqual(0);

  expect(typeof result.superficieAcumuladaHectareas).toBe('number');
  expect(result.superficieAcumuladaHectareas).toBeGreaterThanOrEqual(0);

  expect(typeof result.totalGeneral).toBe('number');
  expect(result.totalGeneral).toBeGreaterThanOrEqual(result.totalProyectos);

  expect(typeof result.superficieGeneralHectareas).toBe('number');
  expect(result.superficieGeneralHectareas).toBeGreaterThanOrEqual(
    result.superficieAcumuladaHectareas
  );

  expect(Array.isArray(result.porEtapa)).toBe(true);
  expect(Array.isArray(result.porMineral)).toBe(true);
  expect(Array.isArray(result.porTipo)).toBe(true);
  expect(Array.isArray(result.porUbicacion)).toBe(true);
});

test('Las estadísticas respetan un filtro sin resultados', async () => {
  const result = await runTestServerFn(() =>
    getProyectosMinerosStatsFn({
      data: {
        nombreLike: 'zzz_proyecto_inexistente_xyz',
      },
    })
  );

  expect(result.totalProyectos).toBe(0);
  expect(result.superficieAcumuladaHectareas).toBe(0);
  expect(result.totalGeneral).toBeGreaterThanOrEqual(0);
  expect(result.superficieGeneralHectareas).toBeGreaterThanOrEqual(0);
  expect(result.porEtapa).toEqual([]);
  expect(result.porMineral).toEqual([]);
  expect(result.porTipo).toEqual([]);
  expect(result.porUbicacion).toEqual([]);
});
