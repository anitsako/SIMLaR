export interface ParcelIdentity {
  readonly name: string | null
  readonly visibleName: string
  readonly tipo: string | null
  readonly expediente: string | null
  readonly denominacion: string | null
}

const FIELD_STOP =
  'EXPEDIENTE|EXPTE|NOMBRE|TITULAR|DEPARTAMEN|TIPO|MINERAL|Has|FID|DENOMINACI|DESCRIPCIO|Descripcion'

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

function stringProp(properties: GeoJSON.GeoJsonProperties, key: string): string | null {
  if (!properties || typeof properties !== 'object') {
    return null
  }
  const value = properties[key]
  return typeof value === 'string' && value !== '' ? value : null
}

function normalizeTipo(raw: string | null): string | null {
  if (!raw) {
    return null
  }
  const t = raw
    .toUpperCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (t.startsWith('PASMA')) return 'PASMA MINA'
  if (t.startsWith('MANIFEST')) return 'MANIFESTACION'
  if (t.startsWith('CATEO')) return 'CATEO'
  if (t.startsWith('CANTERA')) return 'CANTERA'
  if (t.startsWith('MINA')) return 'MINA'
  if (t.startsWith('ALUV')) return 'ALUVION'
  return raw.trim()
}

export function identityFromProperties(
  properties: GeoJSON.GeoJsonProperties | null | undefined,
): ParcelIdentity {
  const name = stringProp(properties ?? null, 'name')
  const description = stringProp(properties ?? null, 'description') ?? ''
  const text = description ? stripHtml(description) : ''
  const tipo = normalizeTipo(fieldAfter(text, 'TIPO'))
  const denominacion = fieldAfter(text, 'DENOMINACI')
  const expediente = fieldAfter(text, 'EXPEDIENTE') ?? fieldAfter(text, 'EXPTE')
  const isMinaLike = tipo === 'MINA' || tipo === 'PASMA MINA'
  const visibleName = isMinaLike && denominacion ? denominacion : (name ?? denominacion ?? '')

  return {
    name,
    visibleName,
    tipo,
    expediente,
    denominacion,
  }
}

export function normalizeName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toUpperCase()
    .replace(/[.'"´`]/g, '')
    .replace(/[_.,;:()/\\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function compactName(value: string): string {
  return normalizeName(value).replace(/\s+/g, '')
}

export function formatCandidateLabel(identity: ParcelIdentity): string {
  const title = identity.visibleName || identity.name || ''
  const isMinaLike = identity.tipo === 'MINA' || identity.tipo === 'PASMA MINA'
  if (isMinaLike && identity.tipo && identity.expediente && identity.expediente !== title) {
    return `${title} - ${identity.tipo} · ${identity.expediente}`
  }
  if (identity.tipo && title) {
    return `${title} - ${identity.tipo}`
  }
  return title
}
