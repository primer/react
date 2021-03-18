import type { Function, Object, String } from "ts-toolbelt"
import * as styledSystem from 'styled-system'
import theme from './theme'

const {get: getKey, compose, system} = styledSystem

// This type and interface only exist to shorten VS Code’s Intellisense
// https://github.com/microsoft/TypeScript/issues/14662#issuecomment-300377719
type TTheme = typeof theme
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ITheme extends TTheme {}

/**
 * Returns the theme value at the specified path
 */
export function get<T extends ITheme, P extends string>(path: Function.AutoPath<T, P>): Object.Path<T, String.Split<P, '.'>> {
  return getKey(theme, path)
}

// Common props

export const COMMON = compose(styledSystem.space, styledSystem.color, styledSystem.display)

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

export const TYPOGRAPHY = compose(styledSystem.typography, whiteSpace)

export interface SystemTypographyProps extends styledSystem.TypographyProps {
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line'
}

// Border props

export const BORDER = compose(styledSystem.border, styledSystem.shadow)

export interface SystemBorderProps extends styledSystem.BorderProps, styledSystem.ShadowProps {}

// Layout props

export const LAYOUT = styledSystem.layout

export type SystemLayoutProps = styledSystem.LayoutProps

// Position props

export const POSITION = styledSystem.position

export type SystemPositionProps = styledSystem.PositionProps

// Flex props

export const FLEX = styledSystem.flexbox

export type SystemFlexProps = styledSystem.FlexboxProps

// Grid props

export const GRID = styledSystem.grid

export type SystemGridProps = styledSystem.GridProps
