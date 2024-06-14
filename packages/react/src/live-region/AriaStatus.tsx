import React from 'react'
import {Announce, type AnnounceProps} from './Announce'

export type AriaStatusProps = AnnounceProps

export function AriaStatus({announceOnShow = false, children, ...rest}: AriaStatusProps) {
  return (
    <Announce {...rest} announceOnShow={announceOnShow} politeness="polite">
      {children}
    </Announce>
  )
}
