export const MAX_ARCHIVO = 20 * 1024 * 1024;

export function validarGeojson(value: unknown): number {
  if (!value || typeof value !== 'object' || !('type' in value) || value.type !== 'FeatureCollection' ||
      !('features' in value) || !Array.isArray(value.features) || !value.features.length || value.features.length > 50000) {
    throw new Error('El GeoJSON debe ser una FeatureCollection con entre 1 y 50.000 elementos.');
  }
  let vertices = 0;
  function position(p: unknown) {
    if (!Array.isArray(p) || p.length < 2 || typeof p[0] !== 'number' || typeof p[1] !== 'number' ||
      !Number.isFinite(p[0]) || !Number.isFinite(p[1]) || Math.abs(p[0]) > 180 || Math.abs(p[1]) > 90) {
      throw new Error('Las coordenadas deben ser longitud y latitud válidas en grados (GeoJSON).');
    }
    if (++vertices > 1000000) throw new Error('El GeoJSON excede un millón de posiciones.');
  }
  function ring(r: unknown) {
    if (!Array.isArray(r) || r.length < 4) throw new Error('Un anillo de polígono debe tener al menos cuatro posiciones.');
    r.forEach(position);
    if (r[0][0] !== r[r.length-1][0] || r[0][1] !== r[r.length-1][1]) throw new Error('Los anillos de los polígonos deben estar cerrados.');
  }
  function polygon(p: unknown) {
    if (!Array.isArray(p) || !p.length) throw new Error('Se encontró un polígono vacío.');
    p.forEach(ring);
  }
  for (const f of value.features) {
    if (!f || f.type !== 'Feature' || !f.geometry) throw new Error('Hay un elemento sin geometría válida.');
    const g = f.geometry;
    if (g.type === 'Point') position(g.coordinates);
    else if (g.type === 'MultiPoint') {
      if (!Array.isArray(g.coordinates) || !g.coordinates.length) throw new Error('Hay un punto múltiple vacío.');
      g.coordinates.forEach(position);
    } else if (g.type === 'Polygon') polygon(g.coordinates);
    else if (g.type === 'MultiPolygon') {
      if (!Array.isArray(g.coordinates) || !g.coordinates.length) throw new Error('Hay un polígono múltiple vacío.');
      g.coordinates.forEach(polygon);
    } else throw new Error('El visor admite Point, MultiPoint, Polygon y MultiPolygon. No se publicaron los datos.');
  }
  return value.features.length;
}

export function validarFecha(fecha: string) {
  const date = new Date(fecha + 'T00:00:00Z');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0,10) !== fecha) {
    throw new Error('Ingresá una fecha de corte válida.');
  }
}
