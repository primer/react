import React from 'react'
import {cn} from '../../internal/cn'

export interface BranchNameProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  as?: React.ElementType
}

export const BranchName = React.forwardRef<HTMLElement, BranchNameProps>(function BranchName(
  {as: Component = 'a', className, ...rest},
  ref,
) {
  return (
    <Component
      {...rest}
      ref={ref}
      data-component="BranchName"
      className={cn(
        'inline-block max-w-full truncate rounded-sm bg-neutral-muted px-1 font-mono text-sm text-default hover:bg-neutral-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        className,
      )}
    />
  )
})

BranchName.displayName = 'BranchName'
