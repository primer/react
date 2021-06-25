import styled from 'styled-components'
import {compose, fontSize, FontSizeProps, variant} from 'styled-system'
import {ComponentProps} from '../utils/types'
import buttonBaseStyles from './ButtonStyles'

export const buttonSystemProps = compose(fontSize)
export type ButtonSystemProps = FontSizeProps

const variants = variant({
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

type StyledButtonBaseProps = {
  as?: 'button' | 'a' | 'summary' | 'input' | string | React.ReactType
  variant?: 'small' | 'medium' | 'large'
} & FontSizeProps

const ButtonBase = styled.button.attrs<StyledButtonBaseProps>(({disabled, onClick}) => ({
  onClick: disabled ? undefined : onClick
}))<StyledButtonBaseProps>`
  ${buttonBaseStyles}
  ${variants}
`

ButtonBase.defaultProps = {
  variant: 'medium'
}

export type ButtonBaseProps = ComponentProps<typeof ButtonBase>
export default ButtonBase
