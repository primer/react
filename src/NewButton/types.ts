import React, {HTMLAttributes} from 'react'
import {IconProps} from '@primer/octicons-react'
import {SxProp} from '../sx'

export type VariantType = 'default' | 'primary' | 'invisible' | 'danger' | 'outline'

export type Size = 'small' | 'medium' | 'large'

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
} & SxProp &
  HTMLAttributes<HTMLButtonElement>

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
