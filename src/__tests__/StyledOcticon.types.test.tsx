import {MoonIcon} from '@primer/octicons-react'
import React from 'react'
import StyledOcticon from '../StyledOcticon'

export function shouldAcceptCallWithNoProps() {
  return <StyledOcticon icon={MoonIcon} />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <StyledOcticon backgroundColor="wheat" />
}
