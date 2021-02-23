import {themeGet} from '@styled-system/theme-get'
import React from 'react'
import * as styledSystem from 'styled-system'
import theme from './theme'

interface StyleFn extends styledSystem.styleFn {
  propTypes?: React.WeakValidationMap<any>
}

const {get: getKey, compose, system} = styledSystem

export const get = (key: string) => themeGet(key, getKey(theme, key))

// Common props

export const COMMON: StyleFn = compose(styledSystem.space, styledSystem.color, styledSystem.display)

export interface SystemCommonProps
  extends styledSystem.ColorProps,
    styledSystem.SpaceProps,
    styledSystem.DisplayProps {}

// Typography props

const whiteSpace = system({
  whiteSpace: {
    property: 'whiteSpace'
    // cssProperty: 'whiteSpace',
  }
})

export const TYPOGRAPHY: StyleFn = compose(styledSystem.typography, whiteSpace)

export interface SystemTypographyProps extends styledSystem.TypographyProps {
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line'
}

// Border props

export const BORDER: StyleFn = compose(styledSystem.border, styledSystem.shadow)

export interface SystemBorderProps extends styledSystem.BorderProps, styledSystem.ShadowProps {}

// Layout props

export const LAYOUT: StyleFn = styledSystem.layout

export type SystemLayoutProps = styledSystem.LayoutProps

// Position props

export const POSITION: StyleFn = styledSystem.position

export type SystemPositionProps = styledSystem.PositionProps

// Flex props

export const FLEX: StyleFn = styledSystem.flexbox

export type SystemFlexProps = styledSystem.FlexboxProps

// Grid props

export const GRID: StyleFn = styledSystem.grid

export type SystemGridProps = styledSystem.GridProps
