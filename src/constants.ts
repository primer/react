import * as StyledSystem from 'styled-system'
import PropTypes from 'prop-types'
import systemPropTypes from '@styled-system/prop-types'
import { themeGet } from '@styled-system/theme-get'
import theme from './theme'
import { SystemStyleObject } from '@styled-system/css'
import * as History from 'history'

const { get: getKey, compose, system } = StyledSystem

export const get = (key: string) => themeGet(key, getKey(theme, key))

const whiteSpace = system({
  whiteSpace: {
    property: 'whiteSpace',
    // cssProperty: 'whiteSpace' // TODO[mkt]: this doesn't exist on TS type, is this necessary?
  }
})

const whiteSpacePropTypes = { whiteSpace: PropTypes.oneOf(['normal', 'nowrap', 'pre-wrap', 'pre', 'pre-line']) }

export interface StyleFnWithPropTypes<T> extends StyledSystem.styleFn {
  propTypes: T
}

export const TYPOGRAPHY = compose(StyledSystem.typography, whiteSpace) as StyleFnWithPropTypes<typeof systemPropTypes.typography & typeof whiteSpacePropTypes>

TYPOGRAPHY.propTypes = {
  ...systemPropTypes.typography,
  ...whiteSpacePropTypes
}

export const COMMON = compose(StyledSystem.space, StyledSystem.color, StyledSystem.display) as StyleFnWithPropTypes<typeof systemPropTypes.space & typeof systemPropTypes.color>
COMMON.propTypes = {
  ...systemPropTypes.space,
  ...systemPropTypes.color
}
export const BORDER = compose(StyledSystem.border, StyledSystem.shadow) as StyleFnWithPropTypes<typeof systemPropTypes.border & typeof systemPropTypes.shadow>
BORDER.propTypes = {
  ...systemPropTypes.border,
  ...systemPropTypes.shadow
}

export const LAYOUT = StyledSystem.layout as StyleFnWithPropTypes<typeof systemPropTypes.layout>
export const POSITION = StyledSystem.position as StyleFnWithPropTypes<typeof systemPropTypes.position>
export const FLEX = StyledSystem.flexbox as StyleFnWithPropTypes<typeof systemPropTypes.flexbox>
export const GRID = StyledSystem.grid as StyleFnWithPropTypes<typeof systemPropTypes.grid>

// TYPOGRAPHY.propTypes = systemPropTypes.typography
LAYOUT.propTypes = systemPropTypes.layout
POSITION.propTypes = systemPropTypes.position
FLEX.propTypes = systemPropTypes.flexbox
GRID.propTypes = systemPropTypes.grid

export interface BaseProps extends React.Props<any> {
  as?: React.ReactType
  className?: string
  css?: string
  sx?: SystemStyleObject
  title?: string
  // NOTE(@mxstbr): Necessary workaround to make <Component as={Link} to="/bla" /> work
  to?: History.LocationDescriptor,
  theme?: { [key: string]: any }
}

export interface CommonProps extends BaseProps, StyledSystem.ColorProps, StyledSystem.SpaceProps { }

export interface LayoutProps extends BaseProps, StyledSystem.LayoutProps { }

export interface TypographyProps extends BaseProps, StyledSystem.TypographyProps {
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line'
}

export interface BorderProps
  extends BaseProps, StyledSystem.BordersProps, StyledSystem.BoxShadowProps { }

export interface PositionProps extends BaseProps, StyledSystem.PositionProps { }

export interface FlexProps extends BaseProps, StyledSystem.FlexboxProps { }
