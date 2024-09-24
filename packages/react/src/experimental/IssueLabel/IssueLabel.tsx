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

  /**
   * The function that gets called when a user clicks the remove button, or keys "Backspace" or "Delete" when focused on the token
   */
  onRemove?: () => void
  /**
   * Whether the token is selected
   */
  isSelected?: boolean
  /**
   * The text label inside the token
   */
  text: React.ReactNode
  /**
   * A unique identifier that can be associated with the token
   */
  id?: number | string

  className?: string
  onClick?: React.MouseEventHandler<HTMLSpanElement | HTMLButtonElement | HTMLAnchorElement>
  onFocus?: React.FocusEventHandler<HTMLSpanElement | HTMLButtonElement | HTMLAnchorElement>
  // onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  // onFocus?: (event: FocusEvent<HTMLElement>) => void
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
    Component = as // If `as` prop is provided, use it explicitly
  } else if (href) {
    Component = 'a' // If `href` is provided and `as` is not set, render as <a>
  } else if (onClick) {
    Component = 'button' // If `onClick` is provided and `href` is not set, render as <button>
  }

  // Set tabIndex to -1 if either onClick, onFocus, or onRemove is provided
  const tabIndex = onClick || onFocus ? -1 : undefined

  // Prepare anchor props if the component is an <a> element
  const anchorProps = href ? {href} : {}

  return (
    <Component
      {...rest}
      {...anchorProps}
      onClick={onClick}
      onFocus={onFocus}
      tabIndex={tabIndex}
      id={id?.toString()}
      className={clsx(classes.IssueLabel, className)}
      data-variant={fillColor ? undefined : variant}
      style={fillColor ? getColorsFromHex(fillColor, resolvedColorScheme, bgColors[mode]) : undefined}
    >
      {text}
    </Component>
  )
}
