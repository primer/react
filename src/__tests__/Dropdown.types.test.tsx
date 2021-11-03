import React from 'react'
import Dropdown from '../Dropdown'

export function shouldAcceptCallWithNoProps() {
  return <Dropdown />
}

export function shouldNotAcceptSystemProps() {
  return (
    <>
      {/* @ts-expect-error system props should not be accepted */}
      <Dropdown.Caret backgroundColor="thistle" />,{/* @ts-expect-error system props should not be accepted */}
      <Dropdown.Menu backgroundColor="thistle" />,{/* @ts-expect-error system props should not be accepted */}
      <Dropdown.Item backgroundColor="thistle" />,
      {/* this will not error for now, but once Button removes styled system props, this line should
        be updated with a @ts-expect-error */}
      <Dropdown.Button backgroundColor="thistle" />
    </>
  )
}
