import React from 'react'
import {Announce} from './Announce'

export type AriaStatusProps = React.PropsWithChildren<{
  /**
   * Specify if the content of the element should be announced when this
   * component is rendered and is not hidden
   * @default false
   */
  announceOnShow?: boolean

  /**
   * Specify if the element is hidden
   * @default false
   */
  hidden?: boolean

  /**
   * Provide a delay in milliseconds before the announcement is made
   */
  delayMs?: number
}>

export function AriaStatus({announceOnShow = false, children, ...rest}: AriaStatusProps) {
  return (
    <Announce {...rest} announceOnShow={announceOnShow} politeness="polite">
      {children}
    </Announce>
  )
}
