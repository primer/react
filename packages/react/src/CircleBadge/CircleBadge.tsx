/* eslint-disable primer-react/spread-props-first */
import Octicon from '../Octicon'
import isNumeric from '../utils/isNumeric'
import type {ComponentProps} from '../utils/types'

import styles from './CircleBadge.module.css'
import type {OcticonProps} from '../Octicon'
import {clsx} from 'clsx'

const variantSizes = {
  small: 56,
  medium: 96,
  large: 128,
}

export type CircleBadgeProps<As extends React.ElementType> = {
  inline?: boolean
  variant?: keyof typeof variantSizes
  size?: number
  as?: As
  className?: string
} & React.ComponentPropsWithRef<React.ElementType extends As ? 'a' : As>

const sizeStyles = ({size, variant = 'medium'}: CircleBadgeProps<React.ElementType>) => {
  const calc = isNumeric(size) ? size : variantSizes[variant]
  return {
    width: calc,
    height: calc,
  }
}

const CircleBadge = <As extends React.ElementType>({as: Component = 'div', ...props}: CircleBadgeProps<As>) => (
  <Component
    {...props}
    className={clsx(styles.CircleBadge, props.className)}
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
