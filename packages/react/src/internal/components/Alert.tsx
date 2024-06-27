import React from 'react'
import {Announce, type AnnounceProps} from './Announce'

export type AlertProps = AnnounceProps

export function Alert({children, ...rest}: AlertProps) {
  return (
    <Announce {...rest} politeness="assertive">
      {children}
    </Announce>
  )
}
