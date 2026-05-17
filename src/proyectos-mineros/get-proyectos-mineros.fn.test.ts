import { expect, test } from 'vitest';
import { getProyectosMinerosFn } from './get-proyectos-mineros.fn';
import { runTestServerFn } from '@/tests/run-test-server-fn';

test('Obtención de proyectos mineros sin filtros devuelve un array', async () => {
  const result = await runTestServerFn(() => getProyectosMinerosFn({ data: {} }));

  expect(Array.isArray(result)).toBe(true);
});

test('Obtención de proyectos mineros devuelve los campos esperados', async () => {
  const result = await runTestServerFn(() => getProyectosMinerosFn({ data: {} }));

  if (result.length > 0) {
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('nombre');
    expect(result[0]).toHaveProperty('tipo');
    expect(result[0].tipo).toHaveProperty('id');
    expect(result[0].tipo).toHaveProperty('nombre');
    expect(result[0].tipo).toHaveProperty('forma');
    expect(result[0]).toHaveProperty('ubicacion');
    expect(result[0]).toHaveProperty('mineral');
    expect(result[0]).toHaveProperty('etapa');
    expect(result[0].etapa).toHaveProperty('id');
    expect(result[0].etapa).toHaveProperty('nombre');
    expect(result[0].etapa).toHaveProperty('color');
    expect(result[0]).toHaveProperty('propietario');
  }
});

test('Obtención de proyectos mineros con limit=1 devuelve a lo sumo un resultado', async () => {
  const result = await runTestServerFn(() => getProyectosMinerosFn({ data: { limit: 1 } }));

  expect(result.length).toBeLessThanOrEqual(1);
});

test("Obtención de proyectos mineros con nombre inexistente devuelve array vacío", async () => {
  const result = await runTestServerFn(() =>
    getProyectosMinerosFn({ data: { nombreLike: 'zzz_no_existe_xyz' } })
  );

  expect(result).toEqual([]);
});
