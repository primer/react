import type {SystemCssProperties, SystemStyleObject} from '@styled-system/css'
import css from '@styled-system/css'
import type {ThemeColorPaths, ThemeShadowPaths} from './theme'
import type {ColorProps, BorderColorProps, ShadowProps} from 'styled-system'

export type BetterCssProperties = {
  [K in keyof SystemCssProperties]: K extends keyof ColorProps
    ? ThemeColorPaths | SystemCssProperties[K]
    : K extends keyof BorderColorProps
      ? ThemeColorPaths | SystemCssProperties[K]
      : K extends keyof ShadowProps
        ? ThemeShadowPaths | SystemCssProperties[K]
        : SystemCssProperties[K]
}

// Support CSS custom properties in the `sx` prop
export type CSSCustomProperties = {
  [key: `--${string}`]: string | number
}

type CSSSelectorObject = {
  [cssSelector: string]: SystemStyleObject | CSSCustomProperties
}

export type BetterSystemStyleObject = BetterCssProperties | SystemStyleObject | CSSCustomProperties | CSSSelectorObject

export interface SxProp {
  /**
   * @deprecated The `sx` prop is deprecated. Replace with a `div` or
   * appropriate HTML element instead, with a CSS class for styling.
   * @see https://github.com/primer/react/blob/main/contributor-docs/migration-from-box.md
   * */
  sx?: BetterSystemStyleObject
}

const sx = (props: SxProp) => css(props.sx)

export default sx
