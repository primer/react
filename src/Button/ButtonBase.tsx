import styled from 'styled-components'
import {compose, fontSize, FontSizeProps, variant} from 'styled-system'
import {COMMON, LAYOUT, SystemCommonProps, SystemLayoutProps} from '../constants'
import {ForwardRefComponent} from '../utils/polymorphic'
import {ComponentProps} from '../utils/types'
import buttonBaseStyles from './ButtonStyles'

export const buttonSystemProps = compose(fontSize, COMMON, LAYOUT)
export type ButtonSystemProps = FontSizeProps & SystemCommonProps & SystemLayoutProps

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

const defaultElement = 'button'

export type ButtonBaseProps = {
  variant?: 'small' | 'medium' | 'large'
} & FontSizeProps

type ButtonBaseComponent = ForwardRefComponent<typeof defaultElement, ButtonBaseProps>

const ButtonBase = styled(defaultElement).attrs<ButtonBaseProps>(({disabled, onClick}) => ({
  onClick: disabled ? undefined : onClick
}))<ButtonBaseProps>`
  ${buttonBaseStyles}
  ${variants}
` as ButtonBaseComponent

ButtonBase.defaultProps = {
  variant: 'medium'
}

// export type ButtonBaseProps = ComponentProps<typeof ButtonBase>
export default ButtonBase
