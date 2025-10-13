import {clsx} from 'clsx'
import type React from 'react'
import {getColorsFromHex} from './getColorFromHex'
import classes from './IssueLabel.module.css'

type Hex = `#${string}`

type LabelColorVariant =
  | 'auburn'
  | 'blue'
  | 'brown'
  | 'coral'
  | 'cyan'
  | 'gray'
  | 'green'
  | 'indigo'
  | 'lemon'
  | 'lime'
  | 'olive'
  | 'orange'
  | 'pine'
  | 'pink'
  | 'plum'
  | 'purple'
  | 'red'
  | 'teal'
  | 'yellow'

type BaseProps = {
  className?: string
  fillColor?: Hex
  variant?: LabelColorVariant
}

type ButtonProps = React.ComponentPropsWithoutRef<'button'> &
  BaseProps & {
    as?: never
    onClick: React.MouseEventHandler<HTMLButtonElement>
  }

type LinkProps = React.ComponentPropsWithoutRef<'a'> &
  BaseProps & {
    as?: never
    href: string
  }

type SpanProps = Omit<React.ComponentPropsWithoutRef<'span'>, 'onClick'> &
  BaseProps & {
    as?: never
    onClick?: never
    href?: never
  }

type IssueLabelAsProps<As extends React.ElementType> = {
  as: As
} & BaseProps &
  Omit<React.ComponentPropsWithoutRef<As>, keyof BaseProps>

type IssueLabelProps<As extends React.ElementType> = SpanProps | LinkProps | ButtonProps | IssueLabelAsProps<As>

function IssueLabel(props: SpanProps): React.ReactNode
function IssueLabel(props: LinkProps): React.ReactNode
function IssueLabel(props: ButtonProps): React.ReactNode
function IssueLabel<As extends React.ElementType>(props: IssueLabelAsProps<As>): React.ReactNode
function IssueLabel<As extends React.ElementType>({
  children,
  className,
  fillColor,
  style,
  variant = 'gray',
  ...props
}: IssueLabelProps<As>): React.ReactNode {
  const resolvedColorScheme = 'light'
  const mode = resolvedColorScheme.startsWith('dark') ? 'dark' : 'light'
  // TODO: get the bgColor, getting it from theme.colorScheme seems a bit sketchy
  const bgColors: Record<string, Hex> = {
    light: '#ffffff',
    dark: '#0d1117',
  }
  const sharedProps = {
    className: clsx(className, classes.IssueLabel),
    'data-variant': fillColor ? undefined : variant,
    style: fillColor ? {...style, ...getColorsFromHex(fillColor, resolvedColorScheme, bgColors[mode])} : style,
  }

  if ('as' in props && props.as) {
    const {as: BaseComponent, ...rest} = props
    return (
      <BaseComponent {...rest} {...sharedProps}>
        {children}
      </BaseComponent>
    )
  }

  if ('href' in props) {
    return (
      <a {...props} {...sharedProps}>
        {children}
      </a>
    )
  }

  if ('onClick' in props) {
    return (
      <button type="button" {...props} {...sharedProps}>
        {children}
      </button>
    )
  }

  return (
    <span {...props} {...sharedProps}>
      {children}
    </span>
  )
}

export {IssueLabel}
export type {IssueLabelProps, Hex}
