import React from 'react'
import {ResponsiveValue} from '../hooks/useResponsiveValue'
import {getBreakpointDeclarations} from '../utils/getBreakpointDeclarations'
import Box from '../Box'

type Viewports = 'narrow' | 'regular' | 'wide'

export type HiddenProps = {
  on: Array<Viewports> | Viewports
  children: React.ReactNode
}

function isArray(value: Array<string> | string): value is Array<string> {
  return Array.isArray(value)
}

export const Hidden = ({on: hiddenViewports, children}: HiddenProps) => {
  let responsiveObj: ResponsiveValue<boolean | number | string> | undefined
  // If we receive array of viewports, we need to tranform this array into ResponsiveValue object
  if (isArray(hiddenViewports)) {
    // ['narrow', 'wide'] -> {narrow: true, regular: false, wide: true}
    hiddenViewports.map(viewport => {
      responsiveObj = {...responsiveObj, [viewport]: true}
    })
    // For string type
  } else if (typeof hiddenViewports === 'string') {
    responsiveObj = {[hiddenViewports]: true}
  } else {
    responsiveObj = {}
  }

  // Get breakpoint declarations for the transformed ResponsiveValue object
  const styles = getBreakpointDeclarations(responsiveObj, 'display', value => {
    if (value) return 'none'
  })

  // Render the children with the styles
  return <Box sx={styles}>{children}</Box>
}
