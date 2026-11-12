export const CATASTRO_LAYER_TYPES = [
  'cateos',
  'manifestaciones',
  'canteras',
  'minas',
  'pasma-minas',
  'aluviones',
  'areas-especiales',
] as const

export type CatastroLayerType = (typeof CATASTRO_LAYER_TYPES)[number]

export const CATASTRO_LAYER_COLORS: Record<CatastroLayerType, string> = {
  cateos: '#2f6f3e',
  manifestaciones: '#1d6fb8',
  canteras: '#c44536',
  minas: '#6b3aa0',
  'pasma-minas': '#0f7f85',
  aluviones: '#8a5a32',
  'areas-especiales': '#c4a035',
}

const FALLBACK_COLOR = '#5d6b75'

export const POLYGON_HOVER_STYLE = {
  color: '#f76108',
  weight: 2,
  opacity: 1,
  fillColor: '#f76108',
  fillOpacity: 0.35,
} as const

export interface PolygonCategoryStyle {
  readonly color: string
  readonly weight: number
  readonly opacity: number
  readonly fillColor: string
  readonly fillOpacity: number
}

const STYLE_URL_TYPE: Record<string, CatastroLayerType> = {
  '#poly-000000-1200-76': 'cateos',
  '#poly-0288d1-1200-76': 'manifestaciones',
  '#poly-0288d1-1200-760': 'manifestaciones',
  '#poly-ff5252-1200-7600': 'canteras',
  '#poly-ff5252-1200-76': 'canteras',
  '#poly-ff5252-1200-760': 'canteras',
  '#msn_ylw-pushpin': 'canteras',
  '#polystyle0020': 'minas',
  '#polystyle002': 'minas',
  '#polystyle0001': 'pasma-minas',
  '#polystyle00001': 'aluviones',
  '#poly-ffea00-1200-760': 'areas-especiales',
  '#msn_ylw-pushpin0': 'areas-especiales',
  '#poly-7cb342-1200-76': 'areas-especiales',
}

const POLY_COLOR_TYPE: Record<string, CatastroLayerType> = {
  '000000': 'cateos',
  '0288d1': 'manifestaciones',
  ff5252: 'canteras',
  ffea00: 'areas-especiales',
  '7cb342': 'areas-especiales',
}

const TIPO_LAYER: Record<string, CatastroLayerType> = {
  CATEO: 'cateos',
  MANIFESTACION: 'manifestaciones',
  CANTERA: 'canteras',
  MINA: 'minas',
  'PASMA MINA': 'pasma-minas',
  'PASMA MINAS': 'pasma-minas',
  ALUVION: 'aluviones',
  ALUVIONES: 'aluviones',
}

function stringProp(
  properties: GeoJSON.GeoJsonProperties | null | undefined,
  key: string,
): string | null {
  if (!properties || typeof properties !== 'object') {
    return null
  }
  const value = properties[key]
  return typeof value === 'string' && value !== '' ? value : null
}

function stripHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function descriptionText(properties: GeoJSON.GeoJsonProperties | null | undefined): string {
  const description = stringProp(properties, 'description')
  return description ? stripHtml(description) : ''
}

function fieldAfter(text: string, key: string): string | null {
  const match = text.match(
    new RegExp(
      `${key}\\s+(.+?)(?=\\s+(?:EXPEDIENTE|EXPTE|NOMBRE|TITULAR|DEPARTAMENTO|DEPARTAMEN|TIPO|MINERAL|Has|FID|DENOMINACI|DESCRIPCIO|Descripcion)\\b|$)`,
      'i',
    ),
  )
  const value = match?.[1]?.trim()
  return value ? value : null
}

function fold(value: string): string {
  return value
    .toUpperCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function tipoFromDescription(text: string): string | null {
  const raw = fieldAfter(text, 'TIPO')
  if (!raw) {
    return null
  }
  const token = fold(raw)
  if (token.startsWith('PASMA')) return 'PASMA MINA'
  if (token.startsWith('MANIFEST')) return 'MANIFESTACION'
  if (token.startsWith('CATEO')) return 'CATEO'
  if (token.startsWith('CANTERA')) return 'CANTERA'
  if (token.startsWith('MINA')) return 'MINA'
  if (token.startsWith('ALUV')) return 'ALUVION'
  return token
}

function layerFromStyleUrl(styleUrl: string | null): CatastroLayerType | null {
  if (!styleUrl) {
    return null
  }
  const normalized = styleUrl.trim().toLowerCase()
  const exact = STYLE_URL_TYPE[normalized]
  if (exact) {
    return exact
  }
  const color = /^#poly-([0-9a-f]{6})-/i.exec(normalized)?.[1]?.toLowerCase()
  return color ? (POLY_COLOR_TYPE[color] ?? null) : null
}

function isSpecialAreaFeature(name: string | null, text: string): boolean {
  const blob = fold(`${name ?? ''} ${text}`)
  return blob.includes('LAGUNA BRAVA') || blob.includes('GUASAMAYO') || blob.includes('TALAMPAYA')
}

export function classifyCatastroLayer(
  properties: GeoJSON.GeoJsonProperties | null | undefined,
): CatastroLayerType | null {
  const text = descriptionText(properties)
  const tipo = tipoFromDescription(text)
  if (tipo) {
    const fromTipo = TIPO_LAYER[tipo]
    if (fromTipo) {
      return fromTipo
    }
  }

  const fromStyle = layerFromStyleUrl(stringProp(properties, 'styleUrl'))
  if (fromStyle) {
    return fromStyle
  }

  if (isSpecialAreaFeature(stringProp(properties, 'name'), text)) {
    return 'areas-especiales'
  }

  return null
}

export function polygonStyleFor(type: CatastroLayerType | null): PolygonCategoryStyle {
  const color = type ? CATASTRO_LAYER_COLORS[type] : FALLBACK_COLOR
  const special = type === 'areas-especiales'
  return {
    color,
    weight: special ? 1.75 : 1.25,
    opacity: 0.95,
    fillColor: color,
    fillOpacity: special ? 0.12 : 0.2,
  }
}
