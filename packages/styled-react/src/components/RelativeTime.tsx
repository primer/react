/* eslint-disable primer-react/spread-props-first */
import {RelativeTime as PrimerRelativeTime, type RelativeTimeProps as PrimerRelativeTimeProps} from '@primer/react'
import React from 'react'
import type {SxProp} from '../sx'
import Box from './Box'

export type RelativeTimeProps = PrimerRelativeTimeProps & SxProp

export function RelativeTime(props: RelativeTimeProps) {
  // @ts-expect-error the types for Box are not correctly inferred here
  return <Box as={PrimerRelativeTime} {...props} />
}
