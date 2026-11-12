import { classifyCatastroLayer, type CatastroLayerType } from './layerType'

export interface ParcelCardInfo {
  readonly name?: string
  readonly type?: CatastroLayerType
  readonly expediente?: string
  readonly titular?: string
  readonly departamento?: string
  readonly superficie?: string
}

const FIELD_STOP =
  'EXPEDIENTE|EXPTE|NOMBRE|TITULAR|DEPARTAMENTO|DEPARTAMEN|TIPO|MINERAL|Has|FID|DENOMINACI|DESCRIPCIO|Descripcion'

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

function fieldAfter(text: string, key: string): string | null {
  const match = text.match(new RegExp(`${key}\\s+(.+?)(?=\\s+(?:${FIELD_STOP})\\b|$)`, 'i'))
  const value = match?.[1]?.trim()
  return value ? value : null
}

function formatSuperficie(raw: string): string {
  const value = raw.trim()
  if (value === '') {
    return value
  }
  if (/ha/i.test(value)) {
    return value
  }
  return `${value} ha`
}

export function parseParcelCard(
  properties: GeoJSON.GeoJsonProperties | null | undefined,
): ParcelCardInfo {
  const text = stringProp(properties, 'description')
  const plain = text ? stripHtml(text) : ''
  const nombre = fieldAfter(plain, 'NOMBRE')
  const denominacion = fieldAfter(plain, 'DENOMINACI')
  const name = nombre ?? denominacion ?? stringProp(properties, 'name') ?? undefined
  const expediente =
    fieldAfter(plain, 'EXPEDIENTE') ?? fieldAfter(plain, 'EXPTE') ?? undefined
  const titular = fieldAfter(plain, 'TITULAR') ?? undefined
  const departamento =
    fieldAfter(plain, 'DEPARTAMENTO') ?? fieldAfter(plain, 'DEPARTAMEN') ?? undefined
  const has = fieldAfter(plain, 'Has')
  const type = classifyCatastroLayer(properties) ?? undefined

  return {
    ...(name ? { name } : {}),
    ...(type ? { type } : {}),
    ...(expediente ? { expediente } : {}),
    ...(titular ? { titular } : {}),
    ...(departamento ? { departamento } : {}),
    ...(has ? { superficie: formatSuperficie(has) } : {}),
  }
}

export function parcelCardHasContent(info: ParcelCardInfo): boolean {
  return Boolean(
    info.name ||
      info.type ||
      info.expediente ||
      info.titular ||
      info.departamento ||
      info.superficie,
  )
}
