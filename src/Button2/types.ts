import React, {HTMLAttributes, ComponentPropsWithRef, ComponentType} from 'react'
import styled from 'styled-components'
import {IconProps} from '@primer/octicons-react'
import sx, {SxProp} from '../sx'

export const StyledButton = styled.button<SxProp>(sx)

export type VariantType = 'default' | 'primary' | 'invisible' | 'danger' | 'outline'

export type Size = 'small' | 'medium' | 'large'

type StyledButtonProps = ComponentPropsWithRef<typeof StyledButton>

export type ButtonBaseProps = {
  /**
   * Determine's the styles on a button one of 'default' | 'primary' | 'invisible' | 'danger'
   */
  variant?: VariantType
  /**
   * Size of button and fontSize of text in button
   */
  size?: Size
  /**
   * Items that are disabled can not be clicked, selected, or navigated through.
   */
  disabled?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: string | ComponentType<any> | undefined
} & SxProp &
  HTMLAttributes<HTMLElement> &
  StyledButtonProps

export type ButtonProps = {
  /**
   * The leading icon comes before button content
   */
  leadingIcon?: React.FunctionComponent<IconProps>
  /**
   * The trailing icon comes after button content
   */
  trailingIcon?: React.FunctionComponent<IconProps>
  children: React.ReactNode
} & ButtonBaseProps

export type IconButtonProps = {
  /**
   * This is to be used if it is an icon-only button. Will make text visually hidden
   */
  icon: React.FunctionComponent<IconProps>
  iconLabel: string
} & ButtonBaseProps

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
