import type React from 'react'
import type {TooltipDirection} from '../TooltipV2'
import type {IconProps} from '@primer/octicons-react'

export type VariantType = 'default' | 'primary' | 'invisible' | 'danger' | 'link'

export type Size = 'small' | 'medium' | 'large'

export type AlignContent = 'start' | 'center'

type ButtonA11yProps =
  | {'aria-label': string; 'aria-labelledby'?: undefined}
  | {'aria-label'?: undefined; 'aria-labelledby': string}

export type ButtonBaseProps = {
  /**
   * Determines the styles on a button, one of 'default' | 'primary' | 'invisible' | 'danger' | 'link'
   */
  variant?: VariantType
  /**
   * Size of the button and fontSize of the text in the button
   */
  size?: Size
  /**
   * Disables a button. Avoid disabling buttons because it will make them inaccessible to users
   * who rely on keyboard navigation. Buttons that are disabled cannot be clicked, selected, or navigated through.
   */
  disabled?: boolean
  /**
   * Allow a button to fill its container horizontally
   */
  block?: boolean
  /**
   * Specify whether the button is in a loading state
   */
  loading?: boolean
  /**
   * The content to announce to screen readers when loading
   */
  loadingAnnouncement?: string
  /*
   * Whether the button looks visually disabled, but can still accept all the same
   * interactions as an enabled button.
   */
  inactive?: boolean
  /**
   * Whether the button label should wrap to multiple lines if it is longer than the button width
   */
  labelWrap?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export type ButtonProps = {
  /**
   * Content alignment for when visuals are present
   */
  alignContent?: AlignContent

  /**
   * The icon for the IconButton
   */
  icon?: React.FunctionComponent<IconProps> | React.ElementType | React.ReactElement | null

  /**
   * The leading visual which comes before the button content
   */
  leadingVisual?: React.ElementType | React.ReactElement | null

  /**
   * The trailing visual which comes after the button content
   */
  trailingVisual?: React.ElementType | React.ReactElement | null

  /**
   * Trailing action which comes after the trailing visual and is always the last element
   * in the button
   */
  trailingAction?: React.ElementType | null

  children?: React.ReactNode

  count?: number | string
} & ButtonBaseProps

export type IconButtonProps = ButtonA11yProps & {
  icon: React.ElementType
  unsafeDisableTooltip?: boolean
  description?: string
  tooltipDirection?: TooltipDirection
  /** @deprecated Use `keybindingHint` instead. */
  keyshortcuts?: string
  keybindingHint?: string
} & Omit<ButtonBaseProps, 'aria-label' | 'aria-labelledby'>

// adopted from React.AnchorHTMLAttributes
export type LinkButtonProps = {
  underline?: boolean
  download?: string
  href?: string
  hrefLang?: string
  media?: string
  ping?: string
  rel?: string
  target?: string
  type?: string
  referrerPolicy?: React.AnchorHTMLAttributes<HTMLAnchorElement>['referrerPolicy']
}
