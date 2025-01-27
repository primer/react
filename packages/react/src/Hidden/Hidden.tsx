import React, {type CSSProperties} from 'react'
import {clsx} from 'clsx'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {getBreakpointDeclarations} from '../utils/getBreakpointDeclarations'
import Box from '../Box'
import {useFeatureFlag} from '../FeatureFlags'
import classes from './Hidden.module.css'

const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_team'

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
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)
  const normalizedStyles = normalize(when)

  // Get breakpoint declarations for the normalized ResponsiveValue object
  const breakpointSx = getBreakpointDeclarations(normalizedStyles, 'display', () => 'none')

  return enabled ? (
    <div
      className={clsx(className, {[classes.Hidden]: enabled})}
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
  ) : (
    <Box sx={breakpointSx}>{children}</Box>
  )
}

Hidden.displayName = 'Hidden'
