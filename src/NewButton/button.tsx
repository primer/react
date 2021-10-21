import React, {ReactNode} from 'react'
import {fontSize, FontSizeProps, variant} from 'styled-system'
import styled from 'styled-components'
import sx, {SxProp} from '../sx'
import {get} from '../constants'
import buttonBaseStyles from '../Button/ButtonStyles'
import Visual from './visual'
import {Theme} from '../ThemeProvider'

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
type Variant = 'default' | 'primary' | 'invisible' | 'block' | 'danger'

export type ButtonProps = {
  children: ReactNode
  variant: Variant
  size: 'small' | 'medium' | 'large'
} & SxProp &
  FontSizeProps

const getVariantStyles = (theme: Theme, variant: Variant = 'default') => {
  debugger
  const style = {
    default: `
      color: ${get('colors.btn.text')(theme)};
      background-color: ${get('colors.btn.bg')(theme)};
      border-width: 1px;
      border-style: solid;
      border-color: ${get('colors.btn.border')(theme)};
      box-shadow: ${(get('shadows.btn.shadow')(theme), get('shadows.btn.insetShadow')(theme))};
      &:hover {
        background-color: ${get('colors.btn.hoverBg')(theme)};
      }
      // focus must come before :active so that the active box shadow overrides
      &:focus {
        box-shadow: ${get('shadows.btn.focusShadow')(theme)};
      }
      &:active {
        background-color: ${get('colors.btn.selectedBg')(theme)};
        box-shadow: ${get('shadows.btn.shadowActive')(theme)};
      }
      &:disabled {
        color: ${get('colors.primer.fg.disabled')(theme)};
      }
    `,
    primary: `
      color: ${get('colors.btn.primary.text')(theme)},
      backgroundColor: ${get('colors.btn.primary.bg')(theme)},
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: ${get('colors.border.subtle')(theme)},
      boxShadow: ${get('shadows.btn.primary.shadow')(theme)},

      '&:hover': {
        color: ${get('colors.btn.primary.hoverText')(theme)},
        backgroundColor: ${get('colors.btn.primary.hoverBg')(theme)}
      },
      // focus must come before :active so that the active box shadow overrides
      '&:focus': {
        boxShadow: ${get('shadows.btn.primary.focusShadow')(theme)}
      },

      '&:active': {
        backgroundColor: ${get('colors.btn.primary.selectedBg')(theme)},
        boxShadow: ${get('shadows.btn.primary.selectedShadow')(theme)}
      },

      '&:disabled': {
        color: ${get('colors.btn.primary.disabledText')(theme)},
        backgroundColor: ${get('colors.btn.primary.disabledBg')(theme)}
      }`,
    danger: ``,
    invisible: ``,
    block: ``
  }
  debugger
  return style[variant]
}

const ButtonBase = styled.button<ButtonProps>`
  ${buttonBaseStyles}
  ${sizes}
  ${props => getVariantStyles(props.theme, props.variant)}
  ${sx}
  ${fontSize}
`
const Button = ({children, ...props}: ButtonProps) => {
  debugger
  return <ButtonBase {...props}>{children}</ButtonBase>
}

Button.Visual = Visual

export default Button
