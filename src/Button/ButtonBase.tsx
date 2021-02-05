import {WeakValidationMap} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, LAYOUT, SystemCommonProps, SystemLayoutProps} from '../constants'
import theme from '../theme'
import buttonBaseStyles from './ButtonStyles'
import {compose, variant, fontSize} from 'styled-system'
import {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'
import systemPropTypes from '@styled-system/prop-types'
import {FontSizeProps} from 'styled-system'

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

type StyledButtonBaseProps = {
  as?: 'button' | 'a' | 'summary' | 'input' | string | React.ReactType
  fontSize?: FontSizeProps['fontSize']
  variant?: 'small' | 'medium' | 'large'
} & SystemCommonProps &
  SystemLayoutProps &
  SxProp

const ButtonBase = styled.button.attrs<StyledButtonBaseProps>(({disabled, onClick}) => ({
  onClick: disabled ? undefined : onClick
}))<StyledButtonBaseProps>`
  ${buttonBaseStyles}
  ${variants}
`

ButtonBase.defaultProps = {
  theme,
  variant: 'medium'
}

const propTypes: WeakValidationMap<ButtonBaseProps> = {
  as: PropTypes.oneOfType([PropTypes.oneOf(['button', 'a', 'summary', 'input']), PropTypes.elementType]),
  children: PropTypes.node,
  disabled: PropTypes.bool,
  fontSize: systemPropTypes.typography.fontSize,
  onClick: PropTypes.func,
  theme: PropTypes.object,
  variant: PropTypes.oneOf(['small', 'medium', 'large']),
  ...COMMON.propTypes,
  ...LAYOUT.propTypes
}
ButtonBase.propTypes = propTypes

export type ButtonBaseProps = ComponentProps<typeof ButtonBase>
export default ButtonBase
