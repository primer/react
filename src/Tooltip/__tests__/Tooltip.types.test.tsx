import React from 'react'
import {Tooltip} from '..'

export function shouldAcceptCallWithNoProps() {
  return <Tooltip />
}

export function shouldAcceptAdditionalProps() {
  return <Tooltip id="test" style={{}} className="test" />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <Tooltip backgroundColor="thistle" />
}
