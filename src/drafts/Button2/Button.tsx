import React from 'react'
import styled from 'styled-components'
import merge from 'classnames'
import sx, {SxProp} from '../../sx'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../../utils/polymorphic'
import CounterLabel, {CounterLabelProps} from '../../CounterLabel'
import classNames from './Button.module.css'

// keep styled.button underneath to support sx prop
const StyledButton = styled.button<SxProp>(sx)

export type ButtonProps = {
  children: React.ReactNode
  /**
   * Determine's the styles on a button one of 'default' | 'primary' | 'invisible' | 'danger'
   */
  variant?: 'default' | 'primary' | 'invisible' | 'danger' | 'outline'
  /**
   * Size of button and fontSize of text in button
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * Allow button width to fill its container.
   */
  block?: boolean
  /**
   * Content alignment for when visuals are present
   */
  alignContent?: 'start' | 'center'
  /**
   * The leading icon comes before button content
   */
  leadingIcon?: React.ComponentType | null | undefined
  /**
   * The trailing icon comes after button content
   */
  trailingIcon?: React.ComponentType | null | undefined
  /**
   * Trailing action appears to the right of the trailing visual and is always locked to the end
   */
  trailingAction?: React.ComponentType | null | undefined
} & SxProp &
  React.ButtonHTMLAttributes<HTMLButtonElement>

const ButtonComponent = React.forwardRef(
  (
    {
      children,
      variant = 'default',
      size = 'medium',
      block = false,
      leadingIcon: LeadingIcon,
      trailingIcon: TrailingIcon,
      trailingAction: TrailingAction,
      sx,
      className,
      ...props
    },
    forwardedRef,
  ): JSX.Element => {
    return (
      <StyledButton
        type="button"
        className={merge(classNames.button, className)}
        data-variant={variant}
        data-size={size}
        data-block={block}
        ref={forwardedRef}
        sx={sx}
        {...props}
      >
        {LeadingIcon && (
          <span data-component="leadingVisual">
            <LeadingIcon />
          </span>
        )}
        {children}
        {TrailingIcon && (
          <span data-component="trailingVisual">
            <TrailingIcon />
          </span>
        )}
        {TrailingAction && (
          <span data-component="trailingVisual">
            <TrailingAction />
          </span>
        )}
      </StyledButton>
    )
  },
) as PolymorphicForwardRefComponent<'button', ButtonProps>

// scheme is not configurable, always set to default (secondary)
export type ButtonCounterProps = Omit<CounterLabelProps, 'scheme'> & {children: number}

const Counter = ({children, className, ...props}: ButtonCounterProps) => {
  return (
    <CounterLabel className={merge(classNames.counter, className)} data-component="ButtonCounter" {...props}>
      {children}
    </CounterLabel>
  )
}

export const Button = Object.assign(ButtonComponent, {Counter})
