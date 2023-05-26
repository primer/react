import React from 'react'
import {Button} from '../../Button'
import TabNav from '../TabNav'

export function shouldAcceptCallWithNoProps() {
  return (
    <>
      <TabNav />
      <TabNav.Link />
    </>
  )
}

export function shouldNotAcceptSystemProps() {
  return (
    <>
      {/* @ts-expect-error system props should not be accepted */}
      <TabNav backgroundColor="maroon" />
      {/* @ts-expect-error system props should not be accepted */}
      <TabNav.Link backgroundColor="fuchsia" />
    </>
  )
}

export function shouldAcceptButtonAsProps() {
  return <TabNav.Link as={Button} />
}

export function shouldAcceptTabNavLinkprops() {
  return <TabNav.Link to="to something" selected as={Button} />
}
