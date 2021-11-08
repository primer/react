import React, {forwardRef} from 'react'
import {IconProps} from '@primer/octicons-react'
import Box from '../Box'
import {fontSize, FontSizeProps, variant as variantFn} from 'styled-system'
import styled, {css} from 'styled-components'
import sx, {SxProp} from '../sx'
import {get} from '../constants'
import buttonBaseStyles from './buttonStyles'
import {Theme} from '../ThemeProvider'
import {ComponentProps} from '../utils/types'

const sizes = variantFn({
  prop: 'size',
  variants: {
    small: {
      fontSize: 0
    },
    medium: {
      fontSize: 1
    },
    large: {
      fontSize: 2
    }
  }
})
type VariantType = 'default' | 'primary' | 'invisible' | 'danger'

export type ButtonBaseProps = {
  variant?: VariantType
  size?: 'small' | 'medium' | 'large'
  icon?: React.FunctionComponent<IconProps>
  leadingIcon?:React.FunctionComponent<IconProps>
  trailingIcon?: React.FunctionComponent<IconProps>
} & SxProp &
  FontSizeProps

const getVariantStyles = (theme: Theme, variant: VariantType = 'default') => {
  const style = {
    default: css`
      color: ${get('colors.btn.text')};
      background-color: ${get('colors.btn.bg')};
      border-width: 1px;
      border-style: solid;
      border-color: ${get('colors.btn.border')};
      box-shadow: ${(get('shadows.btn.shadow'), get('shadows.btn.insetShadow'))};
      &:hover:not([disabled]) {
        background-color: ${get('colors.btn.hoverBg')};
      }
      // focus must come before :active so that the active box shadow overrides
      &:focus:not([disabled]) {
        box-shadow: ${get('shadows.btn.focusShadow')};
      }
      &:active:not([disabled]) {
        background-color: ${get('colors.btn.selectedBg')};
        box-shadow: ${get('shadows.btn.shadowActive')};
      }
      &:disabled {
        color: ${get('colors.primer.fg.disabled')};
        background-color: ${get('colors.btn.disabledBg')};
      }
    `,
    primary: css`
      color: ${get('colors.btn.primary.text')};
      background-color: ${get('colors.btn.primary.bg')};
      border-width: 1px;
      border-style: solid;
      border-color: ${get('colors.border.subtle')};
      box-shadow: ${get('shadows.btn.primary.shadow')};

      &:hover:not([disabled]) {
        color: ${get('colors.btn.primary.hoverText')};
        background-color: ${get('colors.btn.primary.hoverBg')};
      }
      // focus must come before :active so that the active box shadow overrides
      &:focus:not([disabled]) {
        box-shadow: ${get('shadows.btn.primary.focusShadow')};
      }

      &:active:not([disabled]) {
        background-color: ${get('colors.btn.primary.selectedBg')};
        box-shadow: ${get('shadows.btn.primary.selectedShadow')};
      }

      &:disabled {
        color: ${get('colors.btn.primary.disabledText')};
        background-color: ${get('colors.btn.primary.disabledBg')};
      }`,
    danger: css`
      color: ${get('colors.btn.danger.text')};
      border: 1px solid ${get('colors.btn.border')};
      background-color: ${get('colors.btn.bg')};
      box-shadow: ${get('shadows.btn.shadow')};

      &:hover:not([disabled]) {
        color: ${get('colors.btn.danger.hoverText')};
        background-color: ${get('colors.btn.danger.hoverBg')};
        border-color: ${get('colors.btn.danger.hoverBorder')};
        box-shadow: ${get('shadows.btn.danger.hoverShadow')};
      }
      // focus must come before :active so that the active box shadow overrides
      &:focus:not([disabled]) {
        border-color: ${get('colors.btn.danger.focusBorder')};
        box-shadow: ${get('shadows.btn.danger.focusShadow')};
      }

      &:active:not([disabled]) {
        color: ${get('colors.btn.danger.selectedText')};
        background-color: ${get('colors.btn.danger.selectedBg')};
        box-shadow: ${get('shadows.btn.danger.selectedShadow')};
        border-color: ${get('colors.btn.danger.selectedBorder')};
      }

      &:disabled {
        color: ${get('colors.btn.danger.disabledText')};
        background-color: ${get('colors.btn.danger.disabledBg')};
        border-color: ${get('colors.btn.danger.disabledBorder')};
      }
    `,
    invisible: css`
      color: ${get('colors.accent.fg')};
      background-color: transparent;
      border: 0;
      border-radius: ${get('radii.2')};
      box-shadow: none;
    
      &:disabled {
        color: ${get('colors.primer.fg.disabled')};
      }
      &:focus:not([disabled]) {
        box-shadow: ${get('shadows.btn.focusShadow')};
      }
      &:hover:not([disabled]) {
        background-color: ${get('colors.btn.hoverBg')};
      }
      &:active:not([disabled]) {
        background-color: ${get('colors.btn.selectedBg')};
      }
    `
  }
  return style[variant]
}

const getSizes = (size = 'medium', variant: VariantType = 'default', iconOnly: boolean) => {
  let paddingTop, paddingLeft
  switch (size) {
    case 'small':
      paddingTop = 3
      paddingLeft = 12
      break
    case 'large':
      paddingTop = 9
      paddingLeft = 20
      break
    case 'medium':
    default:
      paddingTop = 5
      paddingLeft = 16
  }
  if (iconOnly) {
    paddingLeft = paddingTop + 2
  }
  if (variant === 'invisible') {
    paddingTop = paddingTop + 1
  }
  return `
    padding:${paddingTop}px ${paddingLeft}px;
  `
}
const ButtonBase = styled.button<ButtonBaseProps & {iconOnly: boolean}>`
  ${buttonBaseStyles}
  ${props => getVariantStyles(props.theme, props.variant)}
  ${props => getSizes(props.size, props.variant, props.iconOnly)}
  ${sizes}
  ${sx}
  ${fontSize}
`

const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, ComponentProps<typeof ButtonBase>>(
  ({children, ...props}, forwardedRef) => {
    const {icon: Icon, leadingIcon: LeadingIcon, trailingIcon: TrailingIcon} = props
    let iconOnly = !!Icon;
    const iconWrapStyles = {
      display: 'inline-block',
    }
    return (
      <ButtonBase ref={forwardedRef} {...props} iconOnly={iconOnly}>
        {LeadingIcon && (
          <Box as='span' data-component='leadingIcon' sx={iconWrapStyles} aria-hidden={!iconOnly}>
            <LeadingIcon />
          </Box>
        )}
        {Icon &&  <Box as='span' sx={{display:'inline-block'}} aria-hidden={!iconOnly}>
            <Icon />
          </Box>}
        <span data-component='text' hidden={Icon? true:false}>{children}</span>
        {TrailingIcon && (
          <Box as='span' data-component='trailingIcon' sx={iconWrapStyles} aria-hidden={!iconOnly}>
            <TrailingIcon />
          </Box>
        )}
      </ButtonBase>
    )
  }
)

Button.displayName = 'Button'

Button.defaultProps = {
  size: 'medium',
  variant: 'default'
}


export type ButtonProps = ComponentProps<typeof Button>
export default Button
