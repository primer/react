'use client'

import React from 'react'
import {cn} from './internal/cn'
import {PortalRootContext} from './internal/portalRoot'
import {mergeRefs} from './internal/refs'

export interface BaseStylesProps extends React.ComponentPropsWithoutRef<'div'> {
  as?: React.ElementType
  color?: string
}

export const BaseStyles = React.forwardRef<HTMLElement, BaseStylesProps>(
  ({as: Component = 'div', children, className, color, style, ...rest}, ref) => {
    const [portalRoot, setPortalRoot] = React.useState<HTMLElement | null>(null)

    return (
      <Component
        {...rest}
        ref={mergeRefs(ref, setPortalRoot)}
        data-component="BaseStyles"
        data-portal-root
        className={cn('primer:font-sans primer:leading-normal primer:text-default', className)}
        style={{
          '--BaseStyles-fgColor': color,
          color: 'var(--BaseStyles-fgColor, var(--fgColor-default))',
          ...style,
        }}
      >
        <PortalRootContext.Provider value={portalRoot}>{children}</PortalRootContext.Provider>
      </Component>
    )
  },
)

BaseStyles.displayName = 'BaseStyles'
