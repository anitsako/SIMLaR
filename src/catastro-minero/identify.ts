import { compactName, formatCandidateLabel, normalizeName, type ParcelIdentity } from './parcelIdentity'

export { formatCandidateLabel }

export const MATCH_EXACT = 1
export const MATCH_NORMALIZED = 2
export const MATCH_DENOMINACION = 3
export const MATCH_SPATIAL = 4

export type MatchRank =
  | typeof MATCH_EXACT
  | typeof MATCH_NORMALIZED
  | typeof MATCH_DENOMINACION
  | typeof MATCH_SPATIAL

export function matchRank(identity: ParcelIdentity, pointName: string): MatchRank {
  if (identity.name === pointName) {
    return MATCH_EXACT
  }

  const compactPoint = compactName(pointName)
  if (identity.name && compactName(identity.name) === compactPoint) {
    return MATCH_NORMALIZED
  }
  if (identity.name && normalizeName(identity.name) === normalizeName(pointName)) {
    return MATCH_NORMALIZED
  }

  const isMinaLike = identity.tipo === 'MINA' || identity.tipo === 'PASMA MINA'
  if (isMinaLike && identity.denominacion) {
    if (identity.denominacion === pointName) {
      return MATCH_DENOMINACION
    }
    if (compactName(identity.denominacion) === compactPoint) {
      return MATCH_DENOMINACION
    }
  }

  return MATCH_SPATIAL
}

export function rankByPointName<T extends { identity: ParcelIdentity; id: number }>(
  candidates: readonly T[],
  pointName: string,
): T[] {
  return [...candidates].sort((a, b) => {
    const rankA = matchRank(a.identity, pointName)
    const rankB = matchRank(b.identity, pointName)
    if (rankA !== rankB) {
      return rankA - rankB
    }
    return a.id - b.id
  })
}
