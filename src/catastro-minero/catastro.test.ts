import { describe, expect, it, vi, afterEach } from 'vitest';
import { PolygonGridIndex, bboxOfRings, pointInMultiPolygon, ringsFromGeometry } from './geometry';
import { fetchCatastroGeoJson } from './geojson';
import { parseParcelCard } from './parcelCard';

const rings = ringsFromGeometry({ type: 'Polygon', coordinates: [
  [[-67,-30],[-66,-30],[-66,-29],[-67,-29],[-67,-30]],
  [[-66.8,-29.8],[-66.6,-29.8],[-66.6,-29.6],[-66.8,-29.6],[-66.8,-29.8]],
] });

describe('identificación catastral', () => {
  it('identifica interior y borde, y excluye huecos y exterior', () => {
    expect(pointInMultiPolygon(-66.2, -29.2, rings)).toBe(true);
    expect(pointInMultiPolygon(-67, -29.5, rings)).toBe(true);
    expect(pointInMultiPolygon(-66.7, -29.7, rings)).toBe(false);
    expect(pointInMultiPolygon(-68, -30, rings)).toBe(false);
  });
  it('conserva todas las parcelas superpuestas para que el usuario elija', () => {
    const index = new PolygonGridIndex<{ id: number; rings: typeof rings; bbox: ReturnType<typeof bboxOfRings> }>();
    index.add({id: 1, rings, bbox: bboxOfRings(rings)});
    index.add({id: 2, rings, bbox: bboxOfRings(rings)});
    expect(index.query(-66.2, -29.2).map(x => x.id)).toEqual([1, 2]);
    expect(index.query(-66.7, -29.7)).toEqual([]);
  });
  it('extrae los atributos disponibles sin inventar los ausentes', () => {
    const card = parseParcelCard({name:'Ejemplo',description:'<b>NOMBRE</b> Ejemplo <br> EXPEDIENTE 123 <br> TITULAR Persona <br> Has 100'});
    expect(card.name).toBe('Ejemplo');
    expect(card.expediente).toBe('123');
    expect(card.superficie).toBe('100 ha');
    expect(card.departamento).toBeUndefined();
  });
});

describe('carga de datos', () => {
  afterEach(() => vi.unstubAllGlobals());
  it('informa archivos ausentes sin devolver una capa vacía como válida', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('',{status:404})));
    const result = await fetchCatastroGeoJson(['/ausente.geojson']);
    expect(result.collections).toHaveLength(0);
    expect(result.failed[0].error.kind).toBe('load');
  });
  it('rechaza un JSON que no sea una colección geográfica', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}')));
    const result = await fetchCatastroGeoJson(['/invalido.geojson']);
    expect(result.failed[0].error.kind).toBe('invalid');
  });
});
