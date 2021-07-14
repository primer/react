import css, {
  AllSystemCSSProperties,
  ResponsiveStyleValue,
  VariantProperty,
  SystemStyleObject as StyledSystemSystemStyleObject
} from '@styled-system/css'

import {Pseudos} from 'csstype'
import {Theme} from './ThemeProvider'

export interface SxProp {
  sx?: SystemStyleObject | undefined
}

/**
 * @todo avoid casting back to ss/css type
 */
const sx = (props: SxProp) => css(props.sx as StyledSystemSystemStyleObject | undefined)

export default sx

/* #region TypeOverrides */

/**
 * We need to override these from `@styled-system/css`
 * and ship those overrides to account for theming in the
 * functions from sx
 */

type CSSPseudoSelectorProps = {[K in Pseudos]?: SystemStyleObject}

interface CSSSelectorObject {
  [cssSelector: string]: SystemStyleObject
}

type SystemCssProperties = {
  [K in keyof AllSystemCSSProperties]:
    | ResponsiveStyleValue<AllSystemCSSProperties[K]>
    | ((theme: Theme) => ResponsiveStyleValue<AllSystemCSSProperties[K]>)
    | SystemStyleObject
}

interface UseThemeFunction {
  (theme: Theme): SystemStyleObject
}

interface EmotionLabel {
  label?: string
}

type SystemStyleObject =
  | SystemCssProperties
  | CSSPseudoSelectorProps
  | CSSSelectorObject
  | VariantProperty
  | UseThemeFunction
  | EmotionLabel
  | null
  | undefined

/* #endregion  */
