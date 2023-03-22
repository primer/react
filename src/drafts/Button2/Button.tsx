import React from 'react'
import styled from 'styled-components'
import sx, {SxProp} from '../../sx'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../../utils/polymorphic'

import classNames from './Button.css'

// keep styled.button underneath to support sx prop
const StyledButton = styled.button<SxProp>(sx)

export type ButtonProps = {
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
  children: React.ReactNode
  /**
   * Content alignment for when visuals are present
   */
  alignContent?: 'start' | 'center'
} & SxProp &
  React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button = React.forwardRef(
  ({children, variant = 'default', size = 'medium', block = false, sx, ...props}, forwardedRef): JSX.Element => {
    return (
      <StyledButton
        type="button"
        className={classNames.button}
        data-variant={variant}
        data-size={size}
        data-block={block}
        ref={forwardedRef}
        sx={sx}
        {...props}
      >
        {children}
      </StyledButton>
    )
  },
) as PolymorphicForwardRefComponent<'button', ButtonProps>
