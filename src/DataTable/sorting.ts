export type SortDirection = 'none' | 'ascending' | 'descending'
export type SortState = {
  // Exclude 'none' as this ordering should default to the "initial order" of
  // the collection
  direction: Omit<SortDirection, 'none'>
}
export type SortStrategyHandler<T> = (a: T, b: T, state: SortState) => number
export type SortStrategy<T> = 'string' | 'number' | SortStrategyHandler<T>

export function transition(direction: SortDirection): SortDirection {
  // none -> ascending
  if (direction === 'none') {
    return 'ascending'
  }

  // ascending -> descending
  if (direction === 'ascending') {
    return 'descending'
  }

  // descending -> none
  return 'none'
}

export function sortByString<T extends string>(a: T, b: T, state: SortState) {
  if (state.direction === 'ascending') {
    return a.localeCompare(b)
  }
  return b.localeCompare(a)
}

export function sortByNumber<T extends number>(a: T, b: T, state: SortState) {
  if (state.direction === 'ascending') {
    return a - b
  }
  return b - a
}
