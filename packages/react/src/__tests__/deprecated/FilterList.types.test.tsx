import React from 'react'
import FilterList from '../../deprecated/FilterList'

export function shouldAcceptCallWithNoProps() {
  return <FilterList />
}

export function shouldNotAcceptSystemProps() {
  return (
    <>
      {/* @ts-expect-error system props should not be accepted */}
      <FilterList backgroundColor="thistle" />
      {/* @ts-expect-error system props should not be accepted */}
      <FilterList.Item backgroundColor="thistle" />
    </>
  )
}
