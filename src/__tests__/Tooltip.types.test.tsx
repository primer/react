import React from 'react'
import {Tooltip} from '../Tooltip'

export function shouldNotAcceptCallWithMissingProps() {
  // @ts-expect-error props missing
  return <Tooltip />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <Tooltip backgroundColor="thistle" />
}
