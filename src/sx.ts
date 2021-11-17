import css, {SystemCssProperties, SystemStyleObject} from '@styled-system/css'
import {ThemeColorPaths, ThemeShadowPaths} from './theme'
import {ColorProps, ShadowProps} from 'styled-system'
import merge from 'deepmerge'

export type BetterCssProperties = {
  [K in keyof SystemCssProperties]: K extends keyof ColorProps
    ? ThemeColorPaths | SystemCssProperties[K]
    : K extends keyof ShadowProps
    ? ThemeShadowPaths | SystemCssProperties[K]
    : SystemCssProperties[K]
}

export type BetterSystemStyleObject = BetterCssProperties | SystemStyleObject

export interface SxProp {
  sx?: BetterSystemStyleObject
}

const sx = (props: SxProp) => css(props.sx)

export default sx

export {merge}
