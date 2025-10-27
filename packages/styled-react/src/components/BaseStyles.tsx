/* eslint-disable primer-react/spread-props-first */
import type React from 'react'
import {type CSSProperties, type PropsWithChildren} from 'react'
import {clsx} from 'clsx'
// eslint-disable-next-line import/no-namespace
import type * as styledSystem from 'styled-system'
import {useTheme} from './ThemeProvider'

import 'focus-visible'
import {createGlobalStyle} from 'styled-components'

export interface SystemCommonProps
  extends styledSystem.ColorProps,
    styledSystem.SpaceProps,
    styledSystem.DisplayProps {}

export interface SystemTypographyProps extends styledSystem.TypographyProps {
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line'
}

const GlobalStyle = createGlobalStyle<{colorScheme?: 'light' | 'dark'}>`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
  }

  table {
    /* stylelint-disable-next-line primer/borders */
    border-collapse: collapse;
  }

  [data-color-mode='light'] input {
    color-scheme: light;
  }

  [data-color-mode='dark'] input {
    color-scheme: dark;
  }

  @media (prefers-color-scheme: light) {
    [data-color-mode='auto'][data-light-theme*='light'] {
      color-scheme: light;
    }
  }

  @media (prefers-color-scheme: dark) {
    [data-color-mode='auto'][data-dark-theme*='dark'] {
      color-scheme: dark;
    }
  }

  [role='button']:focus:not(:focus-visible):not(:global(.focus-visible)),
  [role='tabpanel'][tabindex='0']:focus:not(:focus-visible):not(:global(.focus-visible)),
  button:focus:not(:focus-visible):not(:global(.focus-visible)),
  summary:focus:not(:focus-visible):not(:global(.focus-visible)),
  a:focus:not(:focus-visible):not(:global(.focus-visible)) {
    outline: none;
    box-shadow: none;
  }

  [tabindex='0']:focus:not(:focus-visible):not(:global(.focus-visible)),
  details-dialog:focus:not(:focus-visible):not(:global(.focus-visible)) {
    outline: none;
  }

  /* -------------------------------------------------------------------------- */

  .BaseStyles {
    font-family: var(--BaseStyles-fontFamily, var(--fontStack-system));
    /* stylelint-disable-next-line primer/typography */
    line-height: var(--BaseStyles-lineHeight, 1.5);
    /* stylelint-disable-next-line primer/colors */
    color: var(--BaseStyles-fgColor, var(--fgColor-default));

    /* Global styles for light mode */
    &:has([data-color-mode='light']) {
      input & {
        color-scheme: light;
      }
    }

    /* Global styles for dark mode */
    &:has([data-color-mode='dark']) {
      input & {
        color-scheme: dark;
      }
    }

    /* Low-specificity default link styling */
    :where(a:not([class*='prc-']):not([class*='PRC-']):not([class*='Primer_Brand__'])) {
      color: var(--fgColor-accent, var(--color-accent-fg));
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`

export type BaseStylesProps = PropsWithChildren & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: React.ComponentType<any> | keyof JSX.IntrinsicElements
  className?: string
  style?: CSSProperties
  color?: string // Fixes `color` ts-error
} & SystemTypographyProps &
  SystemCommonProps

export function BaseStyles({
  children,
  color,
  fontFamily,
  lineHeight,
  className,
  as: Component = 'div',
  style,
  ...rest
}: BaseStylesProps) {
  const {colorMode, colorScheme, dayScheme, nightScheme} = useTheme()

  const baseStyles = {
    ['--BaseStyles-fgColor']: color,
    ['--BaseStyles-fontFamily']: fontFamily,
    ['--BaseStyles-lineHeight']: lineHeight,
  }

  return (
    <Component
      className={clsx('BaseStyles', className)}
      data-portal-root
      /**
       * We need to map valid primer/react color modes onto valid color modes for primer/primitives
       * valid color modes for primer/primitives: auto | light | dark
       * valid color modes for primer/primer: auto | day | night | light | dark
       */
      data-color-mode={colorMode === 'auto' ? 'auto' : colorScheme?.includes('dark') ? 'dark' : 'light'}
      data-light-theme={dayScheme}
      data-dark-theme={nightScheme}
      style={{
        ...baseStyles,
        ...style,
      }}
      {...rest}
    >
      <GlobalStyle colorScheme={colorScheme?.includes('dark') ? 'dark' : 'light'} />
      {children}
    </Component>
  )
}
