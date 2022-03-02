import React from 'react'
import SelectMenu from '../deprecated/SelectMenu'

export function shouldAcceptCallWithNoProps() {
  return <SelectMenu />
}

export function shouldNotAcceptSystemProps() {
  return (
    <>
      {/* @ts-expect-error system props should not be accepted */}
      <SelectMenu backgroundColor="lightgray" />
      {/* @ts-expect-error system props should not be accepted */}
      <SelectMenu.List backgroundColor="lightgreen" />
      {/* @ts-expect-error system props should not be accepted */}
      <SelectMenu.Divider backgroundColor="lightgrey" />
      {/* This will not error for now, but once TextInputProps is fixed, a ts-expect-error can be added */}
      <SelectMenu.Filter backgroundColor="lightpink" />
      {/* @ts-expect-error system props should not be accepted */}
      <SelectMenu.Footer backgroundColor="lightsalmon" />
      {/* @ts-expect-error system props should not be accepted */}
      <SelectMenu.Item backgroundColor="lightseagreen" />
      {/* @ts-expect-error system props should not be accepted */}
      <SelectMenu.Modal backgroundColor="lightskyblue" />
      {/* @ts-expect-error system props should not be accepted */}
      <SelectMenu.Tabs backgroundColor="lightslategray" />
      {/* @ts-expect-error system props should not be accepted */}
      <SelectMenu.Tab backgroundColor="lightslategrey" />
      {/* @ts-expect-error system props should not be accepted */}
      <SelectMenu.TabPanel backgroundColor="lightsteelblue" />
      {/* @ts-expect-error system props should not be accepted */}
      <SelectMenu.Header backgroundColor="lightyellow" />
      {/* @ts-expect-error system props should not be accepted */}
      <SelectMenu.LoadingAnimation backgroundColor="lightcyan" />
    </>
  )
}
