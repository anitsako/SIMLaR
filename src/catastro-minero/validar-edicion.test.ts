import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { validarFecha, validarGeojson } from './validar-edicion';
import { encodePublicAssetPath } from './geojson';

const collection=(geometry:unknown)=>({type:'FeatureCollection',features:[{type:'Feature',geometry,properties:{}}]});
describe('validación de ediciones antes de publicar',()=>{
  it('mantiene la URL temporal usada para revisar el mapa sin publicarlo',()=>expect(encodePublicAssetPath('blob:http://localhost/edicion')).toBe('blob:http://localhost/edicion'));
  it('acepta la recepción original completa sin descartar elementos',()=>{
    const data=JSON.parse(readFileSync('public/catastro-minero/catastro-minero.geojson','utf8'));
    expect(validarGeojson(data)).toBe(2914);
  });
  it('rechaza colecciones vacías',()=>expect(()=>validarGeojson({type:'FeatureCollection',features:[]})).toThrow());
  it('rechaza coordenadas proyectadas en vez de grados',()=>expect(()=>validarGeojson(collection({type:'Point',coordinates:[3300000,6600000]}))).toThrow(/coordenadas/i));
  it('rechaza números no finitos',()=>expect(()=>validarGeojson(collection({type:'Point',coordinates:[NaN,-29]}))).toThrow());
  it('rechaza geometrías no soportadas sin eliminar elementos silenciosamente',()=>expect(()=>validarGeojson(collection({type:'LineString',coordinates:[[-67,-29],[-66,-30]]}))).toThrow(/admite/));
  it('rechaza polígonos abiertos',()=>expect(()=>validarGeojson(collection({type:'Polygon',coordinates:[[[-67,-29],[-66,-29],[-66,-30],[-67,-30]]]}))).toThrow(/cerrados/));
  it('rechaza fechas inexistentes',()=>expect(()=>validarFecha('2026-02-30')).toThrow());
  it('acepta una fecha real de año bisiesto',()=>expect(()=>validarFecha('2024-02-29')).not.toThrow());
});
