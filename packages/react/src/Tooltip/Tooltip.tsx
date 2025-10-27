/* eslint-disable primer-react/spread-props-first */
import {clsx} from 'clsx'
import React, {useMemo} from 'react'
import {useId} from '../hooks'
import classes from './Tooltip.module.css'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

/* Tooltip v1 */

/**
 * @deprecated
 */
export type TooltipProps = {
  direction?: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'
  text?: string
  noDelay?: boolean
  align?: 'left' | 'right'
  wrap?: boolean
} & React.ComponentProps<'span'>

export const TooltipContext = React.createContext<{tooltipId?: string}>({})

/**
 * @deprecated
 */
const Tooltip = React.forwardRef(function Tooltip(
  {as: Component = 'span', direction = 'n', children, className, text, noDelay, align, wrap, id, ...rest},
  ref,
) {
  const tooltipId = useId(id)
  const tooltipClasses = clsx(className, classes.Tooltip, classes[`Tooltip--${direction}`], {
    [classes[`Tooltip--align${align === 'left' ? 'Left' : 'Right'}`]]: align,
    [classes['Tooltip--noDelay']]: noDelay,
    [classes['Tooltip--multiline']]: wrap,
    // maintaining feature parity with old classes
    [`tooltipped-${direction}`]: true,
    [`tooltipped-align-${align === 'left' ? 'left' : 'right'}-2`]: align,
    'tooltipped-no-delay': noDelay,
    'tooltipped-multiline': wrap,
  })

  const value = useMemo(() => ({tooltipId}), [tooltipId])
  return (
    // This provider is used to check if an icon button is wrapped with tooltip or not.
    <TooltipContext.Provider value={value}>
      <Component role="tooltip" aria-label={text} id={tooltipId} {...rest} className={tooltipClasses} ref={ref}>
        {children}
      </Component>
    </TooltipContext.Provider>
  )
}) as PolymorphicForwardRefComponent<'span', TooltipProps> & {
  alignments: string[]
  directions: string[]
}

Tooltip.alignments = ['left', 'right']

Tooltip.directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']

Tooltip.__SLOT__ = Symbol('DEPRECATED_Tooltip')

export default Tooltip
