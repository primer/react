import React, {type ElementType} from 'react'
import {Announce} from './Announce'
import type {SxProp} from '../sx'

export type AriaStatusProps<As extends ElementType> = React.PropsWithChildren<
  {
    /**
     * Customize the element type of the rendered container
     */
    as?: As

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
  } & SxProp
>

export function AriaStatus<As extends ElementType>({
  announceOnShow = false,
  children,
  ...rest
}: AriaStatusProps<As> & React.ComponentPropsWithoutRef<ElementType extends As ? As : 'div'>) {
  return (
    <Announce {...rest} announceOnShow={announceOnShow} politeness="polite">
      {children}
    </Announce>
  )
}
