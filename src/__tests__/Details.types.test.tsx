import React from 'react'
import Details from '../Details'

export function shouldAcceptCallWithNoProps() {
  return <Details />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <Details backgroundColor="thistle" />
}
