import React from 'react'

export type ReactRouterLikeLinkProps = {to: string; children: React.ReactNode; className?: string}

export const ReactRouterLikeLink = React.forwardRef<HTMLAnchorElement, ReactRouterLikeLinkProps>(
  ({to, children, ...props}, ref) => {
    return (
      <a {...props} href={to} ref={ref}>
        {children}
      </a>
    )
  },
)
