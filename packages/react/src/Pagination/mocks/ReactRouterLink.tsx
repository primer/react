import React from 'react'
import {mergeProps} from '../../utils/mergeProps'

export type ReactRouterLikeLinkProps = {to: string; children: React.ReactNode; className?: string}

export const ReactRouterLikeLink = React.forwardRef<HTMLAnchorElement, ReactRouterLikeLinkProps>(
  ({to, children, ...props}, ref) => {
    return (
      <a ref={ref} {...mergeProps({href: to}, props)}>
        {children}
      </a>
    )
  },
)
