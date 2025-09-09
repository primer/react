import type React from 'react'
import {type ElementType} from 'react'
import {Announce} from './Announce'

export type AriaAlertProps<As extends ElementType> = React.PropsWithChildren<{
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
}>

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
