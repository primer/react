/* eslint-disable primer-react/spread-props-first */
import React from 'react'

export type ReactRouterLikeLinkProps = {to: string; children: React.ReactNode; className?: string}

export const ReactRouterLikeLink = React.forwardRef<HTMLAnchorElement, ReactRouterLikeLinkProps>(
  ({to, children, ...props}, ref) => {
    return (
      <a ref={ref} href={to} {...props}>
        {children}
      </a>
    )
  },
)
