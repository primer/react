import React from 'react'
import Pagehead from '../Pagehead'

export function shouldAcceptCallWithNoProps() {
  return <Pagehead />
}

export function shouldNotAcceptSystemProps() {
  return <Pagehead backgroundColor="orchid" />
}
