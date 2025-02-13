import React, {type CSSProperties} from 'react'
import {clsx} from 'clsx'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import classes from './Hidden.module.css'

type Viewport = 'narrow' | 'regular' | 'wide'

export type HiddenProps = {
  when: Array<Viewport> | Viewport
  children: React.ReactNode
  className?: string
  style?: CSSProperties
}

/* Normalize the value that is received from the prop `when`.
 * For array types : ['narrow', 'wide'] -> {narrow: true, wide: true}
 * For string types: 'narrow' -> {narrow: true}
 */
function normalize(hiddenViewports: Array<Viewport> | Viewport): ResponsiveValue<boolean> {
  // For array types
  if (Array.isArray(hiddenViewports)) {
    const breakpoints: ResponsiveValue<boolean> = {}
    // ['narrow', 'wide'] -> {narrow: true, wide: true}
    for (const breakpoint of hiddenViewports) {
      breakpoints[breakpoint] = true
    }
    return breakpoints
  }
  // For string types
  // 'narrow' -> {narrow: true}
  return {
    [hiddenViewports]: true,
  }
}

export const Hidden = ({when, className, style, children}: HiddenProps) => {
  const normalizedStyles = normalize(when)

  return (
    <div
      className={clsx(className, classes.Hidden)}
      style={
        {
          '--hiddenDisplay-narrow': normalizedStyles.narrow ? 'none' : undefined,
          '--hiddenDisplay-regular': normalizedStyles.regular ? 'none' : undefined,
          '--hiddenDisplay-wide': normalizedStyles.wide ? 'none' : undefined,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </div>
  )
}

Hidden.displayName = 'Hidden'
