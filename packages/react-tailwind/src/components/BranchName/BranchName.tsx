import React from 'react'
import {cn} from '../../internal/cn'

const branchNameClassName =
  'primer:inline-block primer:max-w-full primer:rounded-md primer:bg-accent-muted primer:px-1.5 primer:py-0.5 primer:font-mono primer:text-xs primer:leading-[18px] primer:text-accent primer:no-underline primer:[&:not(a)]:text-muted'

export interface BranchNameProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Element to render. Use a non-anchor element when the branch name does not link anywhere. */
  as?: React.ElementType
}

export const BranchName = React.forwardRef<HTMLElement, BranchNameProps>(function BranchName(
  {as: Component = 'a', className, ...rest},
  ref,
) {
  return <Component {...rest} ref={ref} data-component="BranchName" className={cn(branchNameClassName, className)} />
})

BranchName.displayName = 'BranchName'
