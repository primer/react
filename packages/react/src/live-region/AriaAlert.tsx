import React from 'react'
import {Announce} from './Announce'

export type AriaAlertProps = React.PropsWithChildren<{
  /**
   * Specify if the content of the element should be announced when this
   * component is rendered and is not hidden
   * @default true
   */
  announceOnShow?: boolean

  /**
   * Specify if the element is hidden
   * @default false
   */
  hidden?: boolean
}>

export function AriaAlert({announceOnShow = true, children, ...rest}: AriaAlertProps) {
  return (
    <Announce {...rest} announceOnShow={announceOnShow} politeness="assertive">
      {children}
    </Announce>
  )
}
