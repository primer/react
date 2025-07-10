import type React from 'react'
import {getColorsFromHex} from './getColorFromHex'
import {useTheme} from '../../ThemeProvider'
import {clsx} from 'clsx'
import classes from './IssueLabel.module.css'

type Hex = `#${string}`

type LabelColorVariant =
  | 'pink'
  | 'plum'
  | 'purple'
  | 'indigo'
  | 'blue'
  | 'cyan'
  | 'teal'
  | 'pine'
  | 'green'
  | 'lime'
  | 'olive'
  | 'lemon'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'coral'
  | 'gray'
  | 'brown'
  | 'auburn'

type BaseProps = {
  className?: string
  fillColor?: Hex
  variant?: LabelColorVariant
}
type ButtonProps = React.ComponentPropsWithoutRef<'button'>
type LinkProps = React.ComponentPropsWithoutRef<'a'>

type IssueLabelProps<As extends React.ElementType> =
  | ({as?: As} & BaseProps & Omit<React.ComponentPropsWithoutRef<As>, keyof BaseProps>)
  | ({as?: never; href?: never; onClick?: never} & BaseProps & React.ComponentPropsWithoutRef<'span'>)
  | ({as?: never; href: LinkProps['href']; onClick?: LinkProps['onClick']} & BaseProps & LinkProps)
  | ({as?: never; href?: never; onClick: ButtonProps['onClick']} & BaseProps & ButtonProps)

function IssueLabel<As extends React.ElementType = 'span'>(props: IssueLabelProps<As>) {
  const {as, children, className, fillColor, onClick, style, variant = 'gray', ...rest} = props
  const {resolvedColorScheme} = useTheme()
  const mode = resolvedColorScheme?.startsWith('dark') ? 'dark' : 'light'
  // TODO: get the bgColor, getting it from theme.colorScheme seems a bit sketchy
  const bgColors: Record<string, Hex> = {
    light: '#ffffff',
    dark: '#0d1117',
  }

  let BaseComponent = as ?? 'span'
  if (!as) {
    if ('href' in rest) {
      BaseComponent = 'a'
    } else if (onClick) {
      BaseComponent = 'button'
    }
  }

  return (
    <BaseComponent
      {...rest}
      className={clsx(className, classes.IssueLabel)}
      data-variant={fillColor ? undefined : variant}
      onClick={onClick}
      style={fillColor ? {...style, ...getColorsFromHex(fillColor, resolvedColorScheme, bgColors[mode])} : style}
    >
      {children}
    </BaseComponent>
  )
}

export {IssueLabel}
export type {Hex, IssueLabelProps}
