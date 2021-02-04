import styled from 'styled-components'
import ButtonBase, {ButtonBaseProps, systemStyles} from './ButtonBase'
import {get} from '../constants'
import theme from '../theme'
import sx from '../sx'
import {ComponentProps} from '../utils/types'

export const ButtonDanger = styled(ButtonBase)<ButtonBaseProps>`
  color: ${get('buttons.danger.color.default')};
  border: 1px solid ${get('buttons.danger.border.default')};
  background-color: ${get('buttons.danger.bg.default')};
  box-shadow: ${get('buttons.danger.shadow.default')};

  &:hover {
    color: ${get('buttons.danger.color.hover')};
    background-color: ${get('buttons.danger.bg.hover')};
    border-color: ${get('buttons.danger.border.hover')};
    box-shadow: ${get('buttons.danger.shadow.hover')};
  }
  // focus must come before :active so that the active box shadow overrides
  &:focus {
    border-color: transparent;
    box-shadow: ${get('buttons.danger.shadow.focus')};
  }

  &:active {
    color: ${get('buttons.danger.color.active')};
    background-color: ${get('buttons.danger.bg.active')};
    box-shadow: ${get('buttons.danger.shadow.active')};
    border-color: ${get('buttons.danger.border.active')};
  }

  &:disabled {
    color: ${get('buttons.danger.color.disabled')};
    background-color: ${get('buttons.danger.bg.disabled')};
    border: 1px solid ${get('buttons.danger.border.default')};
  }

  ${systemStyles}
  ${sx};
`

ButtonDanger.defaultProps = {
  theme
}

export type ButtonDangerProps = ComponentProps<typeof ButtonDanger>
