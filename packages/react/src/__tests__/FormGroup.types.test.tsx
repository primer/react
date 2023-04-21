import React from 'react'
import FormGroup from '../deprecated/FormGroup'

export function shouldAcceptCallWithNoProps() {
  return <FormGroup />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <FormGroup backgroundColor="thistle" />
}
