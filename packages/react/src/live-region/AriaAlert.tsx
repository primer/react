import type React from 'react'
import {type ElementType} from 'react'
import {Announce} from './Announce'
import type {PolymorphicProps} from '../utils/polymorphic2'

export type AriaAlertProps<As extends ElementType> = PolymorphicProps<
  'div',
  As,
  {
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
  }
>

export function AriaAlert<As extends ElementType = 'div'>({
  announceOnShow = true,
  children,
  ...rest
}: AriaAlertProps<As>) {
  return (
    <Announce {...rest} announceOnShow={announceOnShow} politeness="assertive">
      {children}
    </Announce>
  )
}
