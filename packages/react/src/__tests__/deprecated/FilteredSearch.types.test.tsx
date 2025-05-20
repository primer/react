import FilteredSearch from '../../deprecated/FilteredSearch'

export function shouldAcceptCallWithNoProps() {
  return <FilteredSearch />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <FilteredSearch backgroundColor="rosybrown" />
}
