import styled from 'styled-components'
import {variant} from 'styled-system'
import type {ComponentProps} from '../../utils/types'
import buttonBaseStyles from './ButtonStyles'

const variants = variant({
  variants: {
    small: {
      p: '4px 12px',
      fontSize: 0,
    },
    medium: {
      fontSize: 1,
    },
    large: {
      fontSize: 2,
      p: '10px 20px',
    },
  },
})

type StyledButtonBaseProps = {
  as?: 'button' | 'a' | 'summary' | 'input' | string | React.ElementType
  variant?: 'small' | 'medium' | 'large'
}

const ButtonBase = styled.button.attrs<StyledButtonBaseProps>(({disabled, onClick}) => ({
  onClick: disabled ? undefined : onClick,
}))<StyledButtonBaseProps>`
  ${buttonBaseStyles}
  ${variants}
`

ButtonBase.defaultProps = {
  variant: 'medium',
}

export type ButtonBaseProps = ComponentProps<typeof ButtonBase>
export default ButtonBase
