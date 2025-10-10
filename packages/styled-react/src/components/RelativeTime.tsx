import {Box, RelativeTime as PrimerRelativeTime, type RelativeTimeProps as PrimerRelativeTimeProps} from '@primer/react'
import React from 'react'
import type {SxProp} from '../sx'

export type RelativeTimeProps = PrimerRelativeTimeProps & SxProp

export function RelativeTime(props: RelativeTimeProps) {
  // @ts-expect-error the types for Box are not correctly inferred here
  return <Box as={PrimerRelativeTime} {...props} />
}

// @ts-ignore -- TS doesn't know about the __SLOT__ property
RelativeTime.__SLOT__ = PrimerRelativeTime.__SLOT__
