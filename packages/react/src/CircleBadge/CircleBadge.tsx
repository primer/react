import styled from 'styled-components'
import {get} from '../constants'
import Octicon from '../Octicon'
import type {SxProp} from '../sx'
import sx from '../sx'
import isNumeric from '../utils/isNumeric'
import type {ComponentProps} from '../utils/types'

const variantSizes = {
  small: 56,
  medium: 96,
  large: 128,
}

type StyledCircleBadgeProps = {
  /** Styles the badge to `display: inline` */
  inline?: boolean
  /** Creates a smaller or larger badge. Has no effect if the `size` prop is set */
  variant?: keyof typeof variantSizes
  /** Sets the size of the badge in pixels. Overrides the `variant` prop when set */
  size?: number
} & SxProp

const sizeStyles = ({size, variant = 'medium'}: StyledCircleBadgeProps) => {
  const calc = isNumeric(size) ? size : variantSizes[variant]
  return {
    width: calc,
    height: calc,
  }
}

/**
 * Circle badge visually connects logos of third-party services, eg. in the marketplace.
 * @primerid circle_badge
 * @primerstatus alpha
 * @prmera11yreviewed false
 */
export const CircleBadge = styled.div<StyledCircleBadgeProps>`
  display: ${({inline = false}) => (inline ? 'inline-flex' : 'flex')};
  align-items: center;
  justify-content: center;
  background-color: ${get('colors.canvas.default')};
  border-radius: 50%;
  box-shadow: ${get('shadows.shadow.medium')};
  ${sizeStyles};
  ${sx};
`

/**
 * The icon that appears inside of CircleBadge
 * @alias CircleBadge.Icon
 * @primerparentid circle_badge
 */
export const CircleBadgeIcon = styled(Octicon)`
  height: auto;
  max-width: 60%;
  max-height: 55%;
`

CircleBadgeIcon.displayName = 'CircleBadge.Icon'

export type CircleBadgeProps = ComponentProps<typeof CircleBadge>
export type CircleBadgeIconProps = ComponentProps<typeof CircleBadgeIcon>
