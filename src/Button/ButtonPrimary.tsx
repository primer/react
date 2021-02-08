import styled from 'styled-components'
import ButtonBase, {ButtonBaseProps, ButtonSystemProps, buttonSystemProps} from './ButtonBase'
import {get} from '../constants'
import theme from '../theme'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'

export const ButtonPrimary = styled(ButtonBase)<ButtonBaseProps & ButtonSystemProps & SxProp>`
  color: ${get('buttons.primary.color.default')};
  background-color: ${get('buttons.primary.bg.default')};
  border: 1px solid ${get('buttons.primary.border.default')};
  box-shadow: ${get('buttons.primary.shadow.default')};

  &:hover {
    background-color: ${get('buttons.primary.bg.hover')};
    border-color: ${get('buttons.primary.border.hover')};
  }
  // focus must come before :active so that the active box shadow overrides
  &:focus {
    border-color: transparent;
    box-shadow: ${get('buttons.primary.shadow.focus')};
    background-color: ${get('buttons.primary.bg.focus')};
  }

  &:active {
    background-color: ${get('buttons.primary.bg.active')};
    box-shadow: ${get('buttons.primary.shadow.active')};
    border-color: ${get('buttons.primary.border.active')};
  }

  &:disabled {
    color: ${get('buttons.primary.color.disabled')};
    background-color: ${get('buttons.primary.bg.disabled')};
    border-color: ${get('buttons.primary.border.disabled')};
  }

  ${buttonSystemProps};
  ${sx};
`

ButtonPrimary.defaultProps = {
  theme
}

ButtonPrimary.propTypes = {
  ...ButtonBase.propTypes,
  ...sx.propTypes
}

export type ButtonPrimaryProps = ComponentProps<typeof ButtonPrimary>
export default ButtonPrimary
