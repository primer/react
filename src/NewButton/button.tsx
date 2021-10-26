import React, {forwardRef, ReactNode} from 'react'
import {IconProps, TriangleDownIcon} from '@primer/octicons-react'
import Box from '../Box'
import {fontSize, FontSizeProps, variant} from 'styled-system'
import styled from 'styled-components'
import sx, {SxProp} from '../sx'
import {get} from '../constants'
import buttonBaseStyles from '../Button/ButtonStyles'
import {Theme} from '../ThemeProvider'
import Counter from './counter'

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
  caret?: boolean
  children: ReactNode
  variant: Variant
  size: 'small' | 'medium' | 'large'
  icon?: React.FunctionComponent<IconProps>
} & SxProp &
  FontSizeProps

const getVariantStyles = (theme: Theme, variant: Variant = 'default') => {
  const style = {
    default: `
      padding: 5px 16px;
      color: ${get('colors.btn.text')({theme})};
      background-color: ${get('colors.btn.bg')({theme})};
      border-width: 1px;
      border-style: solid;
      border-color: ${get('colors.btn.border')({theme})};
      box-shadow: ${(get('shadows.btn.shadow')({theme}), get('shadows.btn.insetShadow')({theme}))};
      &:hover {
        background-color: ${get('colors.btn.hoverBg')({theme})};
      }
      // focus must come before :active so that the active box shadow overrides
      &:focus {
        box-shadow: ${get('shadows.btn.focusShadow')({theme})};
      }
      &:active {
        background-color: ${get('colors.btn.selectedBg')({theme})};
        box-shadow: ${get('shadows.btn.shadowActive')({theme})};
      }
      &:disabled {
        color: ${get('colors.primer.fg.disabled')({theme})};
      }
    `,
    primary: `
      padding: 5px 16px;
      color: ${get('colors.btn.primary.text')({theme})};
      background-color: ${get('colors.btn.primary.bg')({theme})};
      border-width: 1px;
      border-style: solid;
      border-color: ${get('colors.border.subtle')({theme})};
      box-shadow: ${get('shadows.btn.primary.shadow')({theme})};

      &:hover {
        color: ${get('colors.btn.primary.hoverText')({theme})};
        background-color: ${get('colors.btn.primary.hoverBg')({theme})};
      }
      // focus must come before :active so that the active box shadow overrides
      &:focus {
        box-shadow: ${get('shadows.btn.primary.focusShadow')({theme})};
      }

      &:active {
        background-color: ${get('colors.btn.primary.selectedBg')({theme})};
        box-shadow: ${get('shadows.btn.primary.selectedShadow')({theme})};
      }

      &:disabled {
        color: ${get('colors.btn.primary.disabledText')({theme})};
        background-color: ${get('colors.btn.primary.disabledBg')({theme})};
      }`,
    danger: `
      padding: 5px 16px;
      color: ${get('colors.btn.danger.text')({theme})};
      border: 1px solid ${get('colors.btn.border')({theme})};
      background-color: ${get('colors.btn.bg')({theme})};
      box-shadow: ${get('shadows.btn.shadow')({theme})};

      &:hover {
        color: ${get('colors.btn.danger.hoverText')({theme})};
        background-color: ${get('colors.btn.danger.hoverBg')({theme})};
        border-color: ${get('colors.btn.danger.hoverBorder')({theme})};
        box-shadow: ${get('shadows.btn.danger.hoverShadow')({theme})};
      }
      // focus must come before :active so that the active box shadow overrides
      &:focus {
        border-color: ${get('colors.btn.danger.focusBorder')({theme})};
        box-shadow: ${get('shadows.btn.danger.focusShadow')({theme})};
      }

      &:active {
        color: ${get('colors.btn.danger.selectedText')({theme})};
        background-color: ${get('colors.btn.danger.selectedBg')({theme})};
        box-shadow: ${get('shadows.btn.danger.selectedShadow')({theme})};
        border-color: ${get('colors.btn.danger.selectedBorder')({theme})};
      }

      &:disabled {
        color: ${get('colors.btn.danger.disabledText')({theme})};
        background-color: ${get('colors.btn.danger.disabledBg')({theme})};
        border-color: ${get('colors.btn.danger.disabledBorder')({theme})};
      }
    `,
    invisible: `
      padding: 6px 16px;
      color: ${get('colors.accent.fg')({theme})};
      background-color: transparent;
      border: 0;
      border-radius: ${get('radii.2')({theme})};
      box-shadow: none;
    
      &:disabled {
        color: ${get('colors.primer.fg.disabled')({theme})};
      }
      &:focus {
        box-shadow: ${get('shadows.btn.focusShadow')({theme})};
      }
      &:hover {
        background-color: ${get('colors.btn.hoverBg')({theme})};
      }
      &:active {
        background-color: ${get('colors.btn.selectedBg')({theme})};
      }
    `,
    block: ``
  }
  return style[variant]
}

type StyleSwitchers = {
  iconOnly: Boolean
}

const ButtonBase = styled.button<ButtonProps & StyleSwitchers>`
  ${buttonBaseStyles}
  ${props => getVariantStyles(props.theme, props.variant)}
  ${sizes}
  ${props => (props.iconOnly ? `padding: 4px 6px;` : '')}
  ${sx}
  ${fontSize}
`
const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(
  ({icon: Icon, caret, children, ...props}) => {
    let iconOnly: Boolean = false
    if (!children) {
      iconOnly = true
    }
    let iconWrapStyles = {
      display: 'inline-block',
      ...(!iconOnly ? {pr: 3} : {})
    }
    return (
      <ButtonBase {...props} iconOnly={iconOnly}>
        {Icon && (
          <Box sx={iconWrapStyles} aria-hidden={!iconOnly}>
            <Icon />
          </Box>
        )}
        {children}
        {caret && (
          <Box sx={{display: 'inline-block', pl: 3}} aria-hidden={true}>
            <TriangleDownIcon />
          </Box>
        )}
      </ButtonBase>
    )
  }
)

Button.displayName = 'Button'

Button.defaultProps = {
  size: 'medium'
}

const NewButton = Object.assign(Button, {
  Counter
})

export default NewButton
