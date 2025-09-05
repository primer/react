import styled from 'styled-components'
import {get} from '../constants'
import Octicon from '../Octicon'
import isNumeric from '../utils/isNumeric'
import type {ComponentProps} from '../utils/types'

const variantSizes = {
  small: 56,
  medium: 96,
  large: 128,
}

type StyledCircleBadgeProps = {
  inline?: boolean
  variant?: keyof typeof variantSizes
  size?: number
}

const sizeStyles = ({size, variant = 'medium'}: StyledCircleBadgeProps) => {
  const calc = isNumeric(size) ? size : variantSizes[variant]
  return {
    width: calc,
    height: calc,
  }
}

const CircleBadge = styled.div<StyledCircleBadgeProps>`
  display: ${({inline = false}) => (inline ? 'inline-flex' : 'flex')};
  align-items: center;
  justify-content: center;
  background-color: ${get('colors.canvas.default')};
  border-radius: 50%;
  box-shadow: ${get('shadows.shadow.medium')};
  ${sizeStyles};
`
const CircleBadgeIcon = styled(Octicon)`
  height: auto;
  max-width: 60%;
  max-height: 55%;
`

CircleBadgeIcon.displayName = 'CircleBadge.Icon'

export type CircleBadgeProps = ComponentProps<typeof CircleBadge>

export type CircleBadgeIconProps = ComponentProps<typeof CircleBadgeIcon>

/**
 * @deprecated This component is deprecated.
 * Replace component with specific icon imports from `@primer/octicons-react` and customized styling.
 */
export default Object.assign(CircleBadge, {Icon: CircleBadgeIcon})
