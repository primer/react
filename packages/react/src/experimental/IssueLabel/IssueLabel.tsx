import React from 'react'
import {getColorsFromHex} from './getColorFromHex'
import {useTheme} from '../../ThemeProvider'
import {clsx} from 'clsx'
import classes from './IssueLabel.module.css'
export type Hex = `#${string}`

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

export interface IssueLabelProps {
  fillColor?: Hex
  variant?: LabelColorVariant
  href?: string
  as?: 'button' | 'a' | 'span'
  text: React.ReactNode
  id?: number | string
  className?: string
  onClick?: React.MouseEventHandler<HTMLSpanElement | HTMLButtonElement | HTMLAnchorElement>
  onFocus?: React.FocusEventHandler<HTMLSpanElement | HTMLButtonElement | HTMLAnchorElement>
}

export function IssueLabel({
  className,
  fillColor,
  variant = 'gray',
  href,
  onClick,
  onFocus,
  text,
  as,
  id,
  ...rest
}: IssueLabelProps) {
  // Error handling: `href` and `onClick` should not be set simultaneously
  if (href && onClick) {
    throw new Error('`href` and `onClick` cannot both be set. Choose either a link (`<a>`) or a button (`<button>`).')
  }

  const {resolvedColorScheme} = useTheme()
  const mode = resolvedColorScheme?.startsWith('dark') ? 'dark' : 'light'
  // TODO: get the bgColor, getting it from theme.colorScheme seems a bit sketchy
  const bgColors: Record<string, Hex> = {
    light: '#ffffff',
    dark: '#0d1117',
  }

  // Determine the component type: Prioritize `as`, then fallback to `href` or `onClick` logic
  let Component: 'a' | 'button' | 'span' = 'span' // Default to <span>

  if (as) {
    Component = as // use 'as' prop if provided
  } else if (href) {
    Component = 'a' // render as <a> if `href` is provided
  } else if (onClick) {
    Component = 'button' // render as <button> if `onClick` is provided
  }

  const anchorProps = href ? {href} : {}

  return (
    <Component
      {...rest}
      {...anchorProps}
      onClick={onClick}
      onFocus={onFocus}
      id={id?.toString()}
      className={clsx(classes.IssueLabel, className)}
      data-variant={fillColor ? undefined : variant}
      style={fillColor ? getColorsFromHex(fillColor, resolvedColorScheme, bgColors[mode]) : undefined}
    >
      {text}
    </Component>
  )
}
