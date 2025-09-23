import Octicon from '../Octicon'
import isNumeric from '../utils/isNumeric'
import type {ComponentProps} from '../utils/types'

import styles from './CircleBadge.module.css'
import type {OcticonProps} from '../Octicon'

const variantSizes = {
  small: 56,
  medium: 96,
  large: 128,
}

export type CircleBadgeProps = {
  inline?: boolean
  variant?: keyof typeof variantSizes
  size?: number
} & React.HTMLAttributes<HTMLDivElement>

const sizeStyles = ({size, variant = 'medium'}: CircleBadgeProps) => {
  const calc = isNumeric(size) ? size : variantSizes[variant]
  return {
    width: calc,
    height: calc,
  }
}

const CircleBadge = (props: CircleBadgeProps) => (
  <div
    {...props}
    className={styles.CircleBadge}
    data-inline={props.inline ? '' : undefined}
    style={sizeStyles(props)}
  />
)

const CircleBadgeIcon = (props: OcticonProps) => <Octicon className={styles.CircleBadgeIcon} {...props} />

CircleBadgeIcon.displayName = 'CircleBadge.Icon'

export type CircleBadgeIconProps = ComponentProps<typeof CircleBadgeIcon>

/**
 * @deprecated This component is deprecated.
 * Replace component with specific icon imports from `@primer/octicons-react` and customized styling.
 */
export default Object.assign(CircleBadge, {Icon: CircleBadgeIcon})
