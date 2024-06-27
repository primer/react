import React from 'react'
import {Announce, type AnnounceProps} from './Announce'

export type StatusProps = AnnounceProps

export function Status({children, ...rest}: StatusProps) {
  return (
    <Announce {...rest} politeness="polite">
      {children}
    </Announce>
  )
}
