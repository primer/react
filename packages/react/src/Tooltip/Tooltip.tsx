import {clsx} from 'clsx'
import React, {useMemo} from 'react'
import {useId} from '../hooks'
import classes from './Tooltip.module.css'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {TooltipContext} from './TooltipContext'

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

const tooltipDirectionClasses = {
  n: classes['Tooltip--n'],
  ne: classes['Tooltip--ne'],
  e: classes['Tooltip--e'],
  se: classes['Tooltip--se'],
  s: classes['Tooltip--s'],
  sw: classes['Tooltip--sw'],
  w: classes['Tooltip--w'],
  nw: classes['Tooltip--nw'],
}

/**
 * @deprecated
 */
const Tooltip = React.forwardRef(function Tooltip(
  {as: Component = 'span', direction = 'n', children, className, text, noDelay, align, wrap, id, ...rest},
  ref,
) {
  const tooltipId = useId(id)
  const tooltipClasses = clsx(
    className,
    classes.Tooltip,
    tooltipDirectionClasses[direction],
    align === 'left' && classes['Tooltip--alignLeft'],
    align === 'right' && classes['Tooltip--alignRight'],
    noDelay && classes['Tooltip--noDelay'],
    wrap && classes['Tooltip--multiline'],
    {
      // maintaining feature parity with old classes
      'tooltipped-n': direction === 'n',
      'tooltipped-ne': direction === 'ne',
      'tooltipped-e': direction === 'e',
      'tooltipped-se': direction === 'se',
      'tooltipped-s': direction === 's',
      'tooltipped-sw': direction === 'sw',
      'tooltipped-w': direction === 'w',
      'tooltipped-nw': direction === 'nw',
      'tooltipped-align-left-2': align === 'left',
      'tooltipped-align-right-2': align === 'right',
      'tooltipped-no-delay': noDelay,
      'tooltipped-multiline': wrap,
    },
  )

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

Tooltip.__SLOT__ = Symbol('Tooltip')

export default Tooltip
