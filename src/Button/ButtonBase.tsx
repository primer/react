import styled from 'styled-components'
import {COMMON, LAYOUT, SystemCommonProps, SystemLayoutProps} from '../constants'
import theme from '../theme'
import buttonBaseStyles from './ButtonStyles'
import {compose, variant, fontSize} from 'styled-system'
import {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'

export const systemStyles = compose(fontSize, COMMON, LAYOUT)

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

type ButtonBaseInternalProps = {
  variant: 'small' | 'medium' | 'large'
} & SystemCommonProps &
  SystemLayoutProps &
  SxProp

export const ButtonBase = styled.button.attrs<ButtonBaseInternalProps>(({disabled, onClick}) => ({
  onClick: disabled ? undefined : onClick
}))<ButtonBaseInternalProps>`
  ${buttonBaseStyles}
  ${variants}
`

ButtonBase.defaultProps = {
  theme,
  variant: 'medium'
}

export type ButtonBaseProps = ComponentProps<typeof ButtonBase>
