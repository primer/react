import React from 'react'
import BranchName from '../BranchName'

export function shouldAcceptCallWithNoProps() {
  return <BranchName />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <BranchName backgroundColor="thistle" />
}
