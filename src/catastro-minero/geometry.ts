export type LonLat = readonly [number, number]
export type Ring = readonly LonLat[]
export type PolygonRings = readonly Ring[]
export type MultiPolygonRings = readonly PolygonRings[]
export type BBox = readonly [minX: number, minY: number, maxX: number, maxY: number]

const BORDER_M = 2
const EPS = 1e-10
const GRID_CELL = 0.15

function ring2d(ring: GeoJSON.Position[]): LonLat[] {
  const pts: LonLat[] = ring.map((c) => [c[0], c[1]])
  const last = pts[pts.length - 1]
  if (
    pts.length >= 2 &&
    last &&
    pts[0][0] === last[0] &&
    pts[0][1] === last[1]
  ) {
    return pts.slice(0, -1)
  }
  return pts
}

export function ringsFromGeometry(
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon,
): MultiPolygonRings {
  if (geometry.type === 'Polygon') {
    return [geometry.coordinates.map(ring2d)]
  }
  return geometry.coordinates.map((polygon) => polygon.map(ring2d))
}

export function bboxOfRings(polygons: MultiPolygonRings): BBox {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const rings of polygons) {
    for (const ring of rings) {
      for (const [x, y] of ring) {
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }
  return [minX, minY, maxX, maxY]
}

function metersPerDegree(lat: number): { lonM: number; latM: number } {
  const latM = 111132.92 - 559.82 * Math.cos((2 * lat * Math.PI) / 180)
  const lonM = 111412.84 * Math.cos((lat * Math.PI) / 180)
  return { lonM, latM }
}

function pointOnSeg(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  epsM: number,
): boolean {
  const { lonM, latM } = metersPerDegree((ay + by + py) / 3)
  const pxx = px * lonM
  const pyy = py * latM
  const axx = ax * lonM
  const ayy = ay * latM
  const bxx = bx * lonM
  const byy = by * latM
  const vx = bxx - axx
  const vy = byy - ayy
  const wx = pxx - axx
  const wy = pyy - ayy
  const c2 = vx * vx + vy * vy
  if (c2 <= EPS) {
    return Math.hypot(wx, wy) <= epsM
  }
  let t = (wx * vx + wy * vy) / c2
  if (t < 0) t = 0
  else if (t > 1) t = 1
  return Math.hypot(pxx - (axx + t * vx), pyy - (ayy + t * vy)) <= epsM
}

function pointInRing(x: number, y: number, ring: Ring): 'in' | 'out' | 'border' {
  let inside = false
  let onBorder = false
  const n = ring.length
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const current = ring[i]
    const previous = ring[j]
    if (!current || !previous) continue
    const [xi, yi] = current
    const [xj, yj] = previous
    if (pointOnSeg(x, y, xi, yi, xj, yj, BORDER_M)) {
      onBorder = true
    }
    const denom = yj - yi
    if ((yi > y) !== (yj > y) && denom !== 0) {
      const xInt = ((xj - xi) * (y - yi)) / denom + xi
      if (x < xInt) inside = !inside
    }
  }
  if (onBorder) return 'border'
  return inside ? 'in' : 'out'
}

function pointInPolygonRings(x: number, y: number, rings: PolygonRings): boolean {
  const outer = rings[0]
  if (!outer) return false
  const outerRel = pointInRing(x, y, outer)
  if (outerRel === 'out') return false
  if (outerRel === 'border') return true
  for (let h = 1; h < rings.length; h++) {
    const hole = rings[h]
    if (!hole) continue
    const holeRel = pointInRing(x, y, hole)
    if (holeRel === 'in') return false
    if (holeRel === 'border') return true
  }
  return true
}

export function pointInMultiPolygon(x: number, y: number, polygons: MultiPolygonRings): boolean {
  return polygons.some((rings) => pointInPolygonRings(x, y, rings))
}

function cellKey(cx: number, cy: number): string {
  return `${cx},${cy}`
}

export interface IndexedGeometry {
  readonly bbox: BBox
  readonly rings: MultiPolygonRings
}

export class PolygonGridIndex<T extends IndexedGeometry> {
  private readonly items: T[] = []
  private readonly cells = new Map<string, number[]>()

  add(item: T): number {
    const id = this.items.length
    this.items.push(item)
    const [minX, minY, maxX, maxY] = item.bbox
    const x0 = Math.floor(minX / GRID_CELL)
    const x1 = Math.floor(maxX / GRID_CELL)
    const y0 = Math.floor(minY / GRID_CELL)
    const y1 = Math.floor(maxY / GRID_CELL)
    for (let cx = x0; cx <= x1; cx++) {
      for (let cy = y0; cy <= y1; cy++) {
        const key = cellKey(cx, cy)
        const bucket = this.cells.get(key)
        if (bucket) {
          bucket.push(id)
        } else {
          this.cells.set(key, [id])
        }
      }
    }
    return id
  }

  query(lon: number, lat: number): T[] {
    const bucket = this.cells.get(cellKey(Math.floor(lon / GRID_CELL), Math.floor(lat / GRID_CELL)))
    if (!bucket || bucket.length === 0) {
      return []
    }

    const hits: T[] = []
    const seen = new Set<number>()
    for (const id of bucket) {
      if (seen.has(id)) continue
      seen.add(id)
      const item = this.items[id]
      if (!item) continue
      const [minX, minY, maxX, maxY] = item.bbox
      if (lon < minX || lon > maxX || lat < minY || lat > maxY) continue
      if (pointInMultiPolygon(lon, lat, item.rings)) {
        hits.push(item)
      }
    }
    return hits
  }
}
