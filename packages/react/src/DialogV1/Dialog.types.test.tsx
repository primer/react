import React from 'react'
import {Dialog} from '../DialogV1'

export function shouldAcceptCallWithNoProps() {
  return <Dialog />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <Dialog backgroundColor="thistle" />
}
