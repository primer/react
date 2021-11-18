import React, {HTMLAttributes} from 'react'
import {IconProps} from '@primer/octicons-react'
import {SxProp} from '../sx'

export type VariantType = 'default' | 'primary' | 'invisible' | 'danger' | 'outline'

export type Size = 'small' | 'medium' | 'large'

export type ButtonProps = {
  /**
   * Determine's the styles on a button one of 'default' | 'primary' | 'invisible' | 'danger'
   */
  variant?: VariantType
  /**
   * Size of button and fontSize of text in button
   */
  size?: Size
  /**
   * This is to be used if it is an icon-only button. Will make text visually hidden
   */
  icon?: React.FunctionComponent<IconProps>
  /**
   * The leading icon comes before button content
   */
  leadingIcon?: React.FunctionComponent<IconProps>
  /**
   * The trailing icon comes after button content
   */
  trailingIcon?: React.FunctionComponent<IconProps>
  /**
   * Items that are disabled can not be clicked, selected, or navigated through.
   */
  disabled?: boolean
  children: React.ReactNode
} & SxProp &
  HTMLAttributes<HTMLButtonElement>
