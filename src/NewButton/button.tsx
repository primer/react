import React from 'react'
import {compose, fontSize, FontSizeProps, variant} from 'styled-system'
import styled from 'styled-components'
import sx, {SxProp} from '../sx'
import {get} from '../constants'
import buttonBaseStyles from '../Button/ButtonStyles'

const sizes = variant({
  prop: 'size',
  variants: {
    small: {
      p: '4px 12px',
      fontSize: 0
    },
    medium: {
      fontSize: 1
    },
    large: {
      fontSize: 2,
      p: '10px 20px'
    }
  }
})

export type ButtonProps = {
  variant: 'default' | 'primary' | 'outline' | 'invisible' | 'block' | 'danger'
  size: 'small' | 'medium' | 'large'
} & SxProp &
  FontSizeProps

const Button = styled.button<ButtonProps>`
  ${buttonBaseStyles}
  ${sizes}
  color: ${get('colors.btn.text')};
  background-color: ${get('colors.btn.bg')};
  border: 1px solid ${get('colors.btn.border')};
  box-shadow: ${get('shadows.btn.shadow')}, ${get('shadows.btn.insetShadow')}};
  &:hover {
    background-color: ${get('colors.btn.hoverBg')};
    border-color: ${get('colors.btn.hoverBorder')};
  }

  // focus must come before :active so that the active box shadow overrides
  &:focus {
    border-color: ${get('colors.btn.focusBorder')};
    box-shadow: ${get('shadows.btn.focusShadow')};
  }

  &:active {
    background-color: ${get('colors.btn.selectedBg')};
    box-shadow: ${get('shadows.btn.shadowActive')};
  }

  &:disabled {
    color: ${get('colors.primer.fg.disabled')};
    background-color: ${get('colors.btn.bg')};
    border-color: ${get('colors.btn.border')};
  }
  ${sx};
  ${fontSize};
`

export default Button
