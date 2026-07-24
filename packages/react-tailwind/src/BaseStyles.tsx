import React from 'react'
import {cn} from './internal/cn'

export interface BaseStylesProps extends React.ComponentPropsWithoutRef<'div'> {
  as?: React.ElementType
  color?: string
}

export const BaseStyles = React.forwardRef<HTMLElement, BaseStylesProps>(
  ({as: Component = 'div', children, className, color, style, ...rest}, ref) => (
    <Component
      {...rest}
      ref={ref}
      data-component="BaseStyles"
      data-portal-root
      className={cn('font-sans leading-normal text-default', className)}
      style={{
        '--BaseStyles-fgColor': color,
        color: 'var(--BaseStyles-fgColor, var(--fgColor-default))',
        ...style,
      }}
    >
      {children}
    </Component>
  ),
)

BaseStyles.displayName = 'BaseStyles'
