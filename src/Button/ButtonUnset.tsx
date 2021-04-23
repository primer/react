import styled from 'styled-components'
import {get} from '../constants'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'
import ButtonBase, {ButtonBaseProps, ButtonSystemProps, buttonSystemProps} from './ButtonBase'

const ButtonUnset = styled(ButtonBase)<ButtonBaseProps & ButtonSystemProps & SxProp>`
  color: ${get('colors.btn.text')};
  background: transparent;
  border: 0;
  box-shadow: unset;

  ${buttonSystemProps};
  ${sx};
`

export type ButtonUnsetProps = ComponentProps<typeof ButtonUnset>
export default ButtonUnset
