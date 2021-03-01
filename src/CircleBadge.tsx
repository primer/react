import styled from 'styled-components'
import {COMMON, get, SystemCommonProps} from './constants'
import StyledOcticon from './StyledOcticon'
import sx, {SxProp} from './sx'
import theme from './theme'
import isNumeric from './utils/isNumeric'
import {ComponentProps} from './utils/types'

const variantSizes = {
  small: 56,
  medium: 96,
  large: 128
}

type StyledCircleBadgeProps = {
  inline?: boolean
  variant?: keyof typeof variantSizes
  size?: number
} & SystemCommonProps &
  SxProp

const sizeStyles = ({size, variant = 'medium'}: StyledCircleBadgeProps) => {
  const calc = isNumeric(size) ? size : variantSizes[variant]
  return {
    width: calc,
    height: calc
  }
}

const CircleBadge = styled.div<StyledCircleBadgeProps>`
  display: ${props => (props.inline ? 'inline-flex' : 'flex')};
  align-items: center;
  justify-content: center;
  background-color: ${get('colors.bg.canvas')};
  border-radius: 50%;
  box-shadow: ${get('shadows.medium')};
  ${COMMON};
  ${sizeStyles};
  ${sx};
`

const CircleBadgeIcon = styled(StyledOcticon)`
  height: auto;
  max-width: 60%;
  max-height: 55%;
`

CircleBadge.defaultProps = {
  inline: false,
  theme
}

CircleBadgeIcon.defaultProps = {
  theme
}

CircleBadgeIcon.displayName = 'CircleBadge.Icon'

export type CircleBadgeProps = ComponentProps<typeof CircleBadge>
export type CircleBadgeIconProps = ComponentProps<typeof CircleBadgeIcon>
export default Object.assign(CircleBadge, {Icon: CircleBadgeIcon})
