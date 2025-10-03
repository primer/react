import {clsx} from 'clsx'
import React, {useMemo} from 'react'
import {useId} from '../hooks'
import classes from './Tooltip.module.css'

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
function Tooltip({direction = 'n', children, className, text, noDelay, align, wrap, id, ...rest}: TooltipProps) {
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
      <span role="tooltip" aria-label={text} id={tooltipId} {...rest} className={tooltipClasses}>
        {children}
      </span>
    </TooltipContext.Provider>
  )
}

Tooltip.alignments = ['left', 'right']

Tooltip.directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']

export default Tooltip
