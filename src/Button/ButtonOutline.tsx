import styled from 'styled-components'
import {get} from '../constants'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'
import ButtonBase, {ButtonBaseProps, ButtonSystemProps, buttonSystemProps} from './ButtonBase'

// TODO:
//
// - Instead of _just_ setting :hover background-color to `colors.btn.hoverBg`,
// change `colors.btn.outline.hoverBg` in primitives
// - Remove `colors.btn.outline.hoverText` from primitives
// - Remove `colors.btn.outline.hoverShadow` from primitives
// - Remove `colors.btn.outline.hoverBorder` from primitives, or change it if we don't just use the default (`colors.btn.hoverBorder`)
// - Remove `colors.btn.outline.selectedText` from primitives
// - Remove `colors.btn.outline.selectedBg` from primitives
// - Instead of _just_ setting :focus box-shadow to `shadows.btn.focusShadow`,
// change `shadows.btn.outline.focusShadow` in primitives
// - Remove `colors.btn.outline.focusBorder`
// - Remove `colors.btn.outline.selectedBg` from primitives, or change it if we don't just use the default (`colors.btn.selectedBg`)
// - Remove `colors.btn.outline.selectedBorder` from primitives
// - Remove `colors.btn.outline.disabledBg` from primitives, or change it if we don't just use the default (`colors.btn.bg`)
// - Remove `colors.btn.outline.text` from primitives, or change it if we don't just use the default (`colors.btn.text`)
// - Remove `colors.btn.outline.disabledText` from primitives, or change it if we don't just use the default (`colors.text.disabled`)
//

const ButtonOutline = styled(ButtonBase)<ButtonBaseProps & ButtonSystemProps & SxProp>`
  color: ${get('colors.btn.text')};
  border: 1px solid ${get('colors.btn.border')};
  background-color: transparent;

  &:hover {
    background-color: ${get('colors.btn.hoverBg')};
    border-color: ${get('colors.btn.hoverBorder')};
  }
  // focus must come before :active so that the active box shadow overrides
  &:focus {
    border-color: ${get('colors.btn.focusBorder')};
    box-shadow: ${get('shadows.btn.focusShadow')};
  }

  // additional selector with high specificity is needed to beat
  // the specificity of the :focus-visible styles in BaseStyles
  &:active,
  &:active:focus:not(:focus-visible):not(.focus-visible) {
    background-color: ${get('colors.btn.selectedBg')};
    box-shadow: ${get('shadows.btn.shadowActive')};
    border-color: ${get('colors.btn.outline.selectedBorder')};
  }

  &:disabled {
    color: ${get('colors.text.disabled')};
    background-color: transparent;
    border-color: ${get('colors.btn.border')};
  }

  ${buttonSystemProps};
  ${sx};
`

export type ButtonOutlineProps = ComponentProps<typeof ButtonOutline>
export default ButtonOutline
