import React from 'react'
import FilteredSearch from '../FilteredSearch'

export function shouldAcceptCallWithNoProps() {
  return <FilteredSearch />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <FilteredSearch backgroundColor="rosybrown" />
}
