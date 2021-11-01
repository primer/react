import styled from 'styled-components'
import {get} from './constants'
import StyledOcticon from './StyledOcticon'
import sx, {SxProp} from './sx'
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
} & SxProp

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
  background-color: ${get('colors.canvas.default')};
  border-radius: 50%;
  box-shadow: ${get('shadows.shadow.medium')};
  ${sizeStyles};
  ${sx};
`

const CircleBadgeIcon = styled(StyledOcticon)`
  height: auto;
  max-width: 60%;
  max-height: 55%;
`

CircleBadge.defaultProps = {
  inline: false
}

CircleBadgeIcon.displayName = 'CircleBadge.Icon'

export type CircleBadgeProps = ComponentProps<typeof CircleBadge>
export type CircleBadgeIconProps = ComponentProps<typeof CircleBadgeIcon>
export default Object.assign(CircleBadge, {Icon: CircleBadgeIcon})
