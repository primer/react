import React from 'react'
import Pagehead from '../Pagehead'

export function shouldAcceptCallWithNoProps() {
  return <Pagehead />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <Pagehead backgroundColor="orchid" />
}
