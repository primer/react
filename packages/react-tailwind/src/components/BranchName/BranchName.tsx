import React from 'react'
import {cn} from '../../internal/cn'

const branchNameClassName =
  'inline-block max-w-full rounded-md bg-accent-muted px-1.5 py-0.5 font-mono text-xs leading-[18px] text-accent no-underline [&:not(a)]:text-muted'

export interface BranchNameProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  as?: React.ElementType
}

export const BranchName = React.forwardRef<HTMLElement, BranchNameProps>(function BranchName(
  {as: Component = 'a', className, ...rest},
  ref,
) {
  return <Component {...rest} ref={ref} data-component="BranchName" className={cn(branchNameClassName, className)} />
})

BranchName.displayName = 'BranchName'
