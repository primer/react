// The directions in which a column can be sorted
// Note: if a table is sorted, one column _must_ have a direction other than
// NONE
export type SortDirection = 'ASC' | 'DESC' | 'NONE'

// A mapping of names to SortDirection
export const SortDirection: {
  [Key in SortDirection]: `${Key}`
} = {
  ASC: 'ASC',
  DESC: 'DESC',
  NONE: 'NONE',
}

// The default sort direction for a column going from NONE to sorted
export const DEFAULT_SORT_DIRECTION = SortDirection.ASC

// Transition the given sort direction to the next direction
// Note: we can only cycle between ASC <-> DESC, NONE is not supported
export function transition(direction: Exclude<SortDirection, 'NONE'>): Exclude<SortDirection, 'NONE'> {
  if (direction === SortDirection.ASC) {
    return SortDirection.DESC
  }
  return SortDirection.ASC
}

export function basic<T>(a: T, b: T) {
  return a === b ? 0 : a < b ? 1 : -1
}

export const strategies = {
  basic,
}
export type SortStrategies = keyof typeof strategies
