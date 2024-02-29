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

// ----------------------------------------------------------------------------
// Sort strategies
// ----------------------------------------------------------------------------

/**
 * A sort strategy for comparing any two values
 */
export function basic<T>(a: T, b: T) {
  return a === b ? 0 : a < b ? -1 : 1
}

/**
 * A sort strategy for comparing two `Date` values. Also includes support for
 * values from `Date.now()`
 */
export function datetime(a: Date | number, b: Date | number): number {
  const timeA = a instanceof Date ? a.getTime() : a
  const timeB = b instanceof Date ? b.getTime() : b
  return timeA > timeB ? 1 : timeA < timeB ? -1 : 0
}

/**
 * Compare two numbers using alphanumeric, or natural order, sorting. This
 * sorting function breaks up the inputs into groups of text and numbers and
 * compares the different sub-groups of each to determine the order of a set of
 * strings
 *
 * @see https://en.wikipedia.org/wiki/Natural_sort_order
 */
export function alphanumeric(inputA: string, inputB: string): number {
  const groupsA = getAlphaNumericGroups(inputA)
  const groupsB = getAlphaNumericGroups(inputB)

  while (groupsA.length !== 0 && groupsB.length !== 0) {
    const a = groupsA.shift()
    const b = groupsB.shift()

    // If the two groups are equal, move on to the next set of groups
    if (a === b) {
      continue
    } else if (typeof a === 'string' && typeof b === 'string') {
      // If both groups are strings, compare them using the current locale
      return a.localeCompare(b)
    } else if (typeof a === 'number' && typeof b === 'number') {
      // If both groups are numbers, compare them numerically
      return a > b ? 1 : -1
    } else if (typeof a === 'number' && typeof b === 'string') {
      // Sort numbers before strings
      return -1
    } else if (typeof a === 'string' && typeof b === 'number') {
      // Sort numbers before strings
      return 1
    } else if (a === undefined || b === undefined) {
      // If either group is undefined, break out of the loop. The input with the
      // fewest number of groups will be ordered first
      break
    }
  }

  // If all else is equal, the string with the fewest number of "groups" is
  // ordered before the other string
  return groupsA.length > groupsB.length ? 1 : -1
}

/**
 * Break up the given input string into groups of text and numbers
 */
function getAlphaNumericGroups(input: string): Array<string | number> {
  const groups = []
  let i = 0

  while (i < input.length) {
    let group = input[i]

    if (isNumeric(group)) {
      while (i + 1 < input.length && isNumeric(input[i + 1])) {
        group = group + input[i + 1]
        i++
      }
      groups.push(parseInt(group, 10))
    } else {
      while (i + 1 < input.length && !isNumeric(input[i + 1])) {
        group = group + input[i + 1]
        i++
      }
      groups.push(group)
    }

    i++
  }

  return groups
}

/**
 * Determine if the given value is a number
 */
function isNumeric(value: string): boolean {
  return !Number.isNaN(parseInt(value, 10))
}

export const strategies = {
  alphanumeric,
  basic,
  datetime,
}

export type SortStrategy = keyof typeof strategies
export type CustomSortStrategy<T> = (a: T, b: T) => number
