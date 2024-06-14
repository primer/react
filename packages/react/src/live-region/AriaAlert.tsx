import React from 'react'
import {Announce, type AnnounceProps} from './Announce'

export type AriaAlertProps = AnnounceProps

export function AriaAlert({announceOnShow = true, children, ...rest}: AriaAlertProps) {
  return (
    <Announce {...rest} announceOnShow={announceOnShow} politeness="assertive">
      {children}
    </Announce>
  )
}
