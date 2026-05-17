import { expect, test } from 'vitest';
import { getImagenesCarrouselFn } from './get-imagenes-carrousel.fn';
import { runTestServerFn } from '@/tests/run-test-server-fn';

// getImagenesCarrouselFn es GET sin sesión: cero mocks, consulta real a la DB.

test('Obtención de imágenes del carrusel devuelve un array', async () => {
  const result = await runTestServerFn(() => getImagenesCarrouselFn());
  expect(Array.isArray(result)).toBe(true);
});

test('Obtención de imágenes del carrusel devuelve los campos esperados', async () => {
  const result = await runTestServerFn(() => getImagenesCarrouselFn());
  if (result.length > 0) {
    const imagen = result[0];
    expect(imagen).toHaveProperty('archivoId');
    expect(imagen).toHaveProperty('positionY');
    expect(imagen).toHaveProperty('orden');
    expect(imagen).toHaveProperty('nombre');
    expect(imagen).toHaveProperty('mimeType');
  }
});

test('Obtención de imágenes del carrusel devuelve resultados ordenados por orden', async () => {
  const result = await runTestServerFn(() => getImagenesCarrouselFn());
  if (result.length > 1) {
    const ordenes = result.map((i) => i.orden ?? 0);
    const sorted = [...ordenes].sort((a, b) => a - b);
    expect(ordenes).toEqual(sorted);
  }
});
