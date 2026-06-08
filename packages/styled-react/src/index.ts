'use client'

// theming depends on styled-components
export {
  /**
   * @deprecated Theming in JavaScript is no longer supported. Prefer using
   * `@primer/primitives` and CSS Modules instead.
   */
  ThemeProvider,

  /**
   * @deprecated Theming in JavaScript is no longer supported. Prefer using
   * `@primer/primitives` and CSS Modules instead.
   */
  useTheme,

  /**
   * @deprecated Theming in JavaScript is no longer supported. Prefer using
   * `@primer/primitives` and CSS Modules instead.
   */
  useColorSchemeVar,

  /**
   * @deprecated Theming in JavaScript is no longer supported. Prefer using
   * `@primer/primitives` and CSS Modules instead.
   */
  type ThemeProviderProps,
} from './components/FeatureFlaggedTheming'

export {
  /**
   * @deprecated Usage of the `sx` prop with this component is no longer
   * supported. Use the component from `@primer/react` with CSS Modules instead.
   */
  BaseStyles,

  /**
   * @deprecated Usage of the `sx` prop with this component is no longer
   * supported. Use the component from `@primer/react` with CSS Modules instead.
   */
  type BaseStylesProps,
} from './components/FeatureFlaggedTheming'

export {
  /**
   * @deprecated Theming in JavaScript is no longer supported. Prefer using
   * `@primer/primitives` and CSS Modules instead.
   */
  theme,
} from '@primer/react'

export {
  /**
   * @deprecated Theming in JavaScript is no longer supported. Prefer using
   * `@primer/primitives` and CSS Modules instead.
   */
  get as themeGet,
} from './theme-get'

export {
  /**
   * @deprecated Theming in JavaScript is no longer supported. Prefer using
   * `@primer/primitives` and CSS Modules instead.
   */
  merge,

  /**
   * @deprecated Styling with the `sx` prop is no longer supported. Use CSS
   * Modules instead
   */
  sx,

  /**
   * @deprecated Styling with the `sx` prop is no longer supported. Use CSS
   * Modules instead
   */
  type SxProp,
} from './sx'

export {
  /**
   * @deprecated Styling with the `sx` prop is no longer supported. Use CSS
   * Modules instead
   */
  type BetterSystemStyleObject,
} from './sx'
