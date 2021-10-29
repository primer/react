import React, {forwardRef} from 'react'
import {IconProps, TriangleDownIcon} from '@primer/octicons-react'
import Box from '../Box'
import {fontSize, FontSizeProps, variant as variantFn} from 'styled-system'
import styled from 'styled-components'
import sx, {SxProp} from '../sx'
import {get} from '../constants'
import buttonBaseStyles from './buttonStyles'
import {Theme} from '../ThemeProvider'
import Counter from './counter'
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
  caret?: boolean
  variant?: VariantType
  size?: 'small' | 'medium' | 'large'
  icon?: React.FunctionComponent<IconProps>
  as?: 'button' | 'a' | 'summary' | 'input' | string | React.ReactType
} & SxProp &
  FontSizeProps

const getVariantStyles = (theme: Theme, variant: VariantType = 'default') => {
  const style = {
    default: `
      color: ${get('colors.btn.text')({theme})};
      background-color: ${get('colors.btn.bg')({theme})};
      border-width: 1px;
      border-style: solid;
      border-color: ${get('colors.btn.border')({theme})};
      box-shadow: ${(get('shadows.btn.shadow')({theme}), get('shadows.btn.insetShadow')({theme}))};
      &:hover:not([disabled]) {
        background-color: ${get('colors.btn.hoverBg')({theme})};
      }
      // focus must come before :active so that the active box shadow overrides
      &:focus:not([disabled]) {
        box-shadow: ${get('shadows.btn.focusShadow')({theme})};
      }
      &:active:not([disabled]) {
        background-color: ${get('colors.btn.selectedBg')({theme})};
        box-shadow: ${get('shadows.btn.shadowActive')({theme})};
      }
      &:disabled {
        color: ${get('colors.primer.fg.disabled')({theme})};
        background-color: ${get('colors.btn.disabledBg')({theme})};
      }
    `,
    primary: `
      color: ${get('colors.btn.primary.text')({theme})};
      background-color: ${get('colors.btn.primary.bg')({theme})};
      border-width: 1px;
      border-style: solid;
      border-color: ${get('colors.border.subtle')({theme})};
      box-shadow: ${get('shadows.btn.primary.shadow')({theme})};

      &:hover:not([disabled]) {
        color: ${get('colors.btn.primary.hoverText')({theme})};
        background-color: ${get('colors.btn.primary.hoverBg')({theme})};
      }
      // focus must come before :active so that the active box shadow overrides
      &:focus:not([disabled]) {
        box-shadow: ${get('shadows.btn.primary.focusShadow')({theme})};
      }

      &:active:not([disabled]) {
        background-color: ${get('colors.btn.primary.selectedBg')({theme})};
        box-shadow: ${get('shadows.btn.primary.selectedShadow')({theme})};
      }

      &:disabled {
        color: ${get('colors.btn.primary.disabledText')({theme})};
        background-color: ${get('colors.btn.primary.disabledBg')({theme})};
      }`,
    danger: `
      color: ${get('colors.btn.danger.text')({theme})};
      border: 1px solid ${get('colors.btn.border')({theme})};
      background-color: ${get('colors.btn.bg')({theme})};
      box-shadow: ${get('shadows.btn.shadow')({theme})};

      &:hover:not([disabled]) {
        color: ${get('colors.btn.danger.hoverText')({theme})};
        background-color: ${get('colors.btn.danger.hoverBg')({theme})};
        border-color: ${get('colors.btn.danger.hoverBorder')({theme})};
        box-shadow: ${get('shadows.btn.danger.hoverShadow')({theme})};
      }
      // focus must come before :active so that the active box shadow overrides
      &:focus:not([disabled]) {
        border-color: ${get('colors.btn.danger.focusBorder')({theme})};
        box-shadow: ${get('shadows.btn.danger.focusShadow')({theme})};
      }

      &:active:not([disabled]) {
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
      color: ${get('colors.accent.fg')({theme})};
      background-color: transparent;
      border: 0;
      border-radius: ${get('radii.2')({theme})};
      box-shadow: none;
    
      &:disabled {
        color: ${get('colors.primer.fg.disabled')({theme})};
      }
      &:focus:not([disabled]) {
        box-shadow: ${get('shadows.btn.focusShadow')({theme})};
      }
      &:hover:not([disabled]) {
        background-color: ${get('colors.btn.hoverBg')({theme})};
      }
      &:active:not([disabled]) {
        background-color: ${get('colors.btn.selectedBg')({theme})};
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
    const {icon: Icon, caret, size} = props
    let iconOnly = false
    if (Icon && !children) {
      iconOnly = true
    }
    const iconWrapStyles = {
      display: 'inline-block',
      ...(!iconOnly ? {pr: 3} : {})
    }
    return (
      <ButtonBase ref={forwardedRef} {...props} iconOnly={iconOnly}>
        {Icon && (
          <Box sx={iconWrapStyles} aria-hidden={!iconOnly}>
            <Icon size={size} />
          </Box>
        )}
        {children}
        {caret && (
          <Box sx={{display: 'inline-block', pl: 3}} aria-hidden={true}>
            <TriangleDownIcon size={size} />
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

const NewButton = Object.assign(Button, {
  Counter
})

export type NewButtonProps = ComponentProps<typeof Button>
export default NewButton
