import {Box, Spinner as PrimerSpinner, type SpinnerProps as PrimerSpinnerProps} from '@primer/react'
import React from 'react'
import type {SxProp} from '../sx'

export type SpinnerProps = PrimerSpinnerProps & SxProp

export function Spinner(props: SpinnerProps) {
  return <Box as={PrimerSpinner} {...props} />
}
