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

const tooltipAlignmentClasses = {
  left: classes['Tooltip--alignLeft'],
  right: classes['Tooltip--alignRight'],
}

const legacyTooltipDirectionClasses = {
  n: 'tooltipped-n',
  ne: 'tooltipped-ne',
  e: 'tooltipped-e',
  se: 'tooltipped-se',
  s: 'tooltipped-s',
  sw: 'tooltipped-sw',
  w: 'tooltipped-w',
  nw: 'tooltipped-nw',
}

const legacyTooltipAlignmentClasses = {
  left: 'tooltipped-align-left-2',
  right: 'tooltipped-align-right-2',
}

function getTooltipClasses({
  align,
  className,
  direction,
  noDelay,
  wrap,
}: {
  align: TooltipProps['align']
  className: TooltipProps['className']
  direction: NonNullable<TooltipProps['direction']>
  noDelay: TooltipProps['noDelay']
  wrap: TooltipProps['wrap']
}) {
  return clsx(
    className,
    classes.Tooltip,
    tooltipDirectionClasses[direction],
    align && tooltipAlignmentClasses[align],
    noDelay && classes['Tooltip--noDelay'],
    wrap && classes['Tooltip--multiline'],
    legacyTooltipDirectionClasses[direction],
    align && legacyTooltipAlignmentClasses[align],
    {
      'tooltipped-no-delay': noDelay,
      'tooltipped-multiline': wrap,
    },
  )
}

/**
 * @deprecated
 */
const Tooltip = React.forwardRef(function Tooltip(
  {as: Component = 'span', direction = 'n', children, className, text, noDelay, align, wrap, id, ...rest},
  ref,
) {
  const tooltipId = useId(id)
  const tooltipClasses = getTooltipClasses({align, className, direction, noDelay, wrap})

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
