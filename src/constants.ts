import type { Function, Object, String } from "ts-toolbelt"
import * as styledSystem from 'styled-system'
import theme from './theme'

const {get: getKey, compose, system} = styledSystem 

/* eslint-disable @typescript-eslint/ban-types */ // allow 'object' type

type TTheme = typeof theme
// This interface is used to shorten editor hints.
// DO NOT REPLACE IT WITH A TYPE, TYPES ARE NOT SHORTENED:
// https://github.com/microsoft/TypeScript/issues/14662#issuecomment-300377719
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITheme extends TTheme {}

// Fake the return type, so default theme values appear in editor hints
// while support for (non-default) themes passed in at runtime is preserved
type GetReturnType<T extends object = ITheme, P extends string = string> = T extends ITheme
  ? Object.Path<T, String.Split<P, '.'>>
  : (customTheme: object) => Object.Path<T, String.Split<P, '.'>>

/**
 * Returns the theme value at the specified path.
 */
export function get<T extends object = ITheme, P extends string = string>(
  path: T extends ITheme ? Function.AutoPath<T, P> : string
): GetReturnType<T, P> {
  return (((customTheme: object) => getKey(customTheme, path) ?? getKey(theme, path)) as unknown) as GetReturnType<T, P>
}

/* eslint-enable @typescript-eslint/ban-types */

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
