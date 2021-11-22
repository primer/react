import React from 'react'
import Dropdown from '../Dropdown'

export function shouldAcceptCallWithNoProps() {
  return <Dropdown />
}

export function shouldNotAcceptSystemProps() {
  return (
    <>
      {/* @ts-expect-error system props should not be accepted */}
      <Dropdown.Caret backgroundColor="thistle" />
      {/* @ts-expect-error system props should not be accepted */}
      <Dropdown.Menu backgroundColor="thistle" />
      {/* @ts-expect-error system props should not be accepted */}
      <Dropdown.Item backgroundColor="thistle" />
      {/* @ts-expect-error system props should not be accepted */}
      <Dropdown.Button backgroundColor="thistle" />
    </>
  )
}
