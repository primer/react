import type {IconProps} from '@primer/octicons-react'
import type React from 'react'
import styles from './CircleOcticon.module.css'

export type CircleOcticonProps = {
  as?: React.ElementType
  size?: number
  icon: React.ComponentType<React.PropsWithChildren<{size?: IconProps['size']}>>
  bg?: string
  'aria-label'?: string
  className?: string
} & React.HTMLAttributes<HTMLElement>

/**
 * @deprecated This component is deprecated. Replace component with specific icon imports from `@primer/octicons-react` and customized styling.)
 */
function CircleOcticon(props: CircleOcticonProps) {
  const {
    size = 32,
    as: Component = 'div',
    icon: IconComponent,
    bg,
    'aria-label': ariaLabel,
    className,
    style,
    ...rest
  } = props

  const wrapperStyle: React.CSSProperties = {
    backgroundColor: bg,
    width: size,
    height: size,
    ...style,
  }

  return (
    <Component className={`${styles.CircleOcticon}${className ? ` ${className}` : ''}`} style={wrapperStyle} {...rest}>
      <IconComponent size={size} aria-label={ariaLabel} />
    </Component>
  )
}

export default CircleOcticon
