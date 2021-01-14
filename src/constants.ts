// @ts-ignore @styled-system/prop-types does not provide type definitions
import systemPropTypes from '@styled-system/prop-types'
import {themeGet} from '@styled-system/theme-get'
import PropTypes from 'prop-types'
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

COMMON.propTypes = {
  ...systemPropTypes.space,
  ...systemPropTypes.color,
}

// Typography props

const whiteSpace = system({
  whiteSpace: {
    property: 'whiteSpace',
    // cssProperty: 'whiteSpace',
  },
})

export const TYPOGRAPHY: StyleFn = compose(styledSystem.typography, whiteSpace)

export interface SystemTypographyProps extends styledSystem.TypographyProps {
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line'
}

TYPOGRAPHY.propTypes = {
  ...systemPropTypes.typography,
  whiteSpace: PropTypes.oneOf(['normal', 'nowrap', 'pre-wrap', 'pre', 'pre-line']),
}

// Border props

export const BORDER: StyleFn = compose(styledSystem.border, styledSystem.shadow)

export interface SystemBorderProps extends styledSystem.BorderProps, styledSystem.ShadowProps {}

BORDER.propTypes = {
  ...systemPropTypes.border,
  ...systemPropTypes.shadow,
}

// Layout props

export const LAYOUT: StyleFn = styledSystem.layout

export interface SystemLayoutProps extends styledSystem.LayoutProps {}

LAYOUT.propTypes = systemPropTypes.layout

// Position props

export const POSITION: StyleFn = styledSystem.position

export interface SystemPositionProps extends styledSystem.PositionProps {}

POSITION.propTypes = systemPropTypes.position

// Flex props

export const FLEX: StyleFn = styledSystem.flexbox

export interface SystemFlexProps extends styledSystem.FlexboxProps {}

FLEX.propTypes = systemPropTypes.flexbox

// Grid props

export const GRID: StyleFn = styledSystem.grid

export interface SystemGridProps extends styledSystem.GridProps {}

GRID.propTypes = systemPropTypes.grid
