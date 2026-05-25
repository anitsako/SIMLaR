import { fromBlob, type GeoTIFFImage } from 'geotiff';

export interface CogMetadata {
  // Bounding box en EPSG:4326 (lat/lon)
  boundsWest: number;
  boundsSouth: number;
  boundsEast: number;
  boundsNorth: number;
  // Centro
  centerLat: number;
  centerLon: number;
  // Elevación (solo si es un MDT de banda única numérica)
  elevationMin: number | null;
  elevationMax: number | null;
  // Características del raster
  crs: string;
  resolucionMetros: number | null;
  anchoPx: number;
  altoPx: number;
  // Cantidad de bandas (1 = MDT, 3-4 = ortofoto RGB/RGBA)
  numBandas: number;
}

/**
 * Lee la metadata de un COG/GeoTIFF directamente en el browser.
 * No descarga el archivo completo: geotiff.js lee solo los headers.
 */
export async function leerMetadataCog(file: File): Promise<CogMetadata> {
  const tiff = await fromBlob(file);
  const image = await tiff.getImage();

  const anchoPx = image.getWidth();
  const altoPx = image.getHeight();
  const numBandas = image.getSamplesPerPixel();

  // Resolución (metros por píxel si está en un CRS proyectado)
  const resolution = image.getResolution();
  const resolucionMetros = resolution ? Math.abs(resolution[0]) : null;

  // Bounding box en las unidades del CRS del archivo
  const bbox = image.getBoundingBox(); // [minX, minY, maxX, maxY]

  // Detectar el CRS
  const geoKeys = image.getGeoKeys();
  const epsgCode =
    geoKeys?.ProjectedCSTypeGeoKey ||
    geoKeys?.GeographicTypeGeoKey ||
    null;
  const crs = epsgCode ? `EPSG:${epsgCode}` : 'desconocido';

  // Convertir el bbox a lat/lon (EPSG:4326)
  const bounds4326 = convertirBboxA4326(bbox, epsgCode);

  // Elevación: solo tiene sentido para MDT de banda única
  let elevationMin: number | null = null;
  let elevationMax: number | null = null;

  if (numBandas === 1) {
    const stats = await calcularMinMax(image);
    elevationMin = stats.min;
    elevationMax = stats.max;
  }

  return {
    boundsWest: bounds4326.west,
    boundsSouth: bounds4326.south,
    boundsEast: bounds4326.east,
    boundsNorth: bounds4326.north,
    centerLat: (bounds4326.south + bounds4326.north) / 2,
    centerLon: (bounds4326.west + bounds4326.east) / 2,
    elevationMin,
    elevationMax,
    crs,
    resolucionMetros,
    anchoPx,
    altoPx,
    numBandas,
  };
}

/**
 * Convierte un bbox de Web Mercator (3857) a lat/lon (4326).
 * Si el CRS ya es 4326, lo devuelve tal cual.
 */
function convertirBboxA4326(
  bbox: number[],
  epsgCode: number | null,
): { west: number; south: number; east: number; north: number } {
  const [minX, minY, maxX, maxY] = bbox;

  // Si ya está en 4326 (lat/lon), devolver directo
  if (epsgCode === 4326) {
    return { west: minX, south: minY, east: maxX, north: maxY };
  }

  // Si es Web Mercator (3857), convertir
  if (epsgCode === 3857) {
    return {
      west: mercatorXaLon(minX),
      south: mercatorYaLat(minY),
      east: mercatorXaLon(maxX),
      north: mercatorYaLat(maxY),
    };
  }

  // Otros CRS: devolver crudo y avisar (necesitaría proj4js para convertir)
  console.warn(
    `CRS EPSG:${epsgCode} no soportado para conversión automática. ` +
    `Se recomienda que el COG esté en EPSG:3857.`,
  );
  return { west: minX, south: minY, east: maxX, north: maxY };
}

// Conversiones Web Mercator → lat/lon
function mercatorXaLon(x: number): number {
  return (x / 20037508.34) * 180;
}

function mercatorYaLat(y: number): number {
  const lat = (y / 20037508.34) * 180;
  return (
    (180 / Math.PI) *
    (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2)
  );
}

/**
 * Calcula min/max de la banda de elevación, ignorando nodata.
 * Lee a baja resolución (un overview) para no procesar millones de píxeles.
 */
async function calcularMinMax(
  image: GeoTIFFImage,
): Promise<{ min: number; max: number }> {
  // Leer a resolución reducida para velocidad (256px de ancho máximo)
  const targetWidth = 256;
  const scale = Math.min(1, targetWidth / image.getWidth());

  const rasters = await image.readRasters({
    width: Math.round(image.getWidth() * scale),
    height: Math.round(image.getHeight() * scale),
  });

  const data = rasters[0] as ArrayLike<number>;
  const nodata = image.getGDALNoData();

  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < data.length; i++) {
    const v = Number(data[i]);
    // Filtrar nodata y valores absurdos
    if (nodata !== null && v === nodata) continue;
    if (!Number.isFinite(v) || v < -10000 || v > 10000) continue;
    if (v < min) min = v;
    if (v > max) max = v;
  }

  return {
    min: min === Infinity ? 0 : Math.round(min * 100) / 100,
    max: max === -Infinity ? 0 : Math.round(max * 100) / 100,
  };
}
