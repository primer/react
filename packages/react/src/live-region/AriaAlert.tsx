import React, {type ElementType} from 'react'
import {Announce} from './Announce'
import type {SxProp} from '../sx'

export type AriaAlertProps<As extends ElementType> = React.PropsWithChildren<
  {
    /**
     * Customize the element type of the rendered container
     */
    as?: As

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
  } & SxProp
>

export function AriaAlert<As extends ElementType>({
  announceOnShow = true,
  children,
  ...rest
}: AriaAlertProps<As> & React.ComponentPropsWithoutRef<ElementType extends As ? As : 'div'>) {
  return (
    <Announce {...rest} announceOnShow={announceOnShow} politeness="assertive">
      {children}
    </Announce>
  )
}
