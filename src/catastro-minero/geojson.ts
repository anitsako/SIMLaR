export type GeoJsonErrorKind = 'load' | 'invalid'

export class CatastroGeoJsonError extends Error {
  readonly kind: GeoJsonErrorKind

  constructor(kind: GeoJsonErrorKind, message: string) {
    super(message)
    this.name = 'CatastroGeoJsonError'
    this.kind = kind
  }
}

export interface LoadedCatastroLayer {
  readonly url: string
  readonly data: GeoJSON.FeatureCollection
}

export interface FailedCatastroLayer {
  readonly url: string
  readonly error: CatastroGeoJsonError
}

export interface CatastroGeoJsonLoadResult {
  readonly collections: readonly LoadedCatastroLayer[]
  readonly failed: readonly FailedCatastroLayer[]
}

export function encodePublicAssetPath(path: string): string {
  // La vista previa administrativa usa una URL temporal creada por el navegador.
  if (path.startsWith('blob:')) return path;
  return path
    .split('/')
    .map((segment) => (segment ? encodeURIComponent(segment) : ''))
    .join('/')
}

function isFeatureCollection(value: unknown): value is GeoJSON.FeatureCollection {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const record = value as { type?: unknown; features?: unknown }
  return record.type === 'FeatureCollection' && Array.isArray(record.features)
}

async function fetchFeatureCollection(url: string): Promise<GeoJSON.FeatureCollection> {
  let response: Response

  try {
    response = await fetch(url)
  } catch (error) {
    console.error(`[catastro] Error de red al cargar GeoJSON: ${url}`, error)
    throw new CatastroGeoJsonError('load', url)
  }

  if (!response.ok) {
    console.error(`[catastro] GeoJSON no disponible (${response.status}): ${url}`)
    throw new CatastroGeoJsonError('load', url)
  }

  let data: unknown

  try {
    data = await response.json()
  } catch (error) {
    console.error(`[catastro] GeoJSON con JSON inválido: ${url}`, error)
    throw new CatastroGeoJsonError('invalid', url)
  }

  if (!isFeatureCollection(data)) {
    console.error(`[catastro] GeoJSON no es FeatureCollection: ${url}`)
    throw new CatastroGeoJsonError('invalid', url)
  }

  return data
}

export async function fetchCatastroGeoJson(
  urls: readonly string[],
): Promise<CatastroGeoJsonLoadResult> {
  if (urls.length === 0) {
    const error = new CatastroGeoJsonError('load', 'empty')
    console.error('[catastro] No hay capas GeoJSON configuradas.', error)
    return { collections: [], failed: [{ url: 'empty', error }] }
  }

  const results = await Promise.allSettled(
    urls.map(async (url) => {
      const data = await fetchFeatureCollection(encodePublicAssetPath(url))
      return { url, data }
    }),
  )

  const collections: LoadedCatastroLayer[] = []
  const failed: FailedCatastroLayer[] = []

  results.forEach((result, index) => {
    const url = urls[index] ?? `layer-${index}`

    if (result.status === 'fulfilled') {
      collections.push(result.value)
      return
    }

    const error =
      result.reason instanceof CatastroGeoJsonError
        ? result.reason
        : new CatastroGeoJsonError('load', url)

    console.error(`[catastro] No se pudo cargar la capa GeoJSON: ${url}`, result.reason)
    failed.push({ url, error })
  })

  return { collections, failed }
}
