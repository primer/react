import type React from 'react'
import {type ElementType} from 'react'
import {Announce} from './Announce'
import type {PolymorphicProps} from '../utils/modern-polymorphic'

export type AriaAlertProps<As extends ElementType> = PolymorphicProps<
  As,
  'div',
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

export function AriaAlert<As extends ElementType = 'div'>(props: AriaAlertProps<As>) {
  return <Announce {...props} announceOnShow={props.announceOnShow ?? true} politeness="assertive" />
}
