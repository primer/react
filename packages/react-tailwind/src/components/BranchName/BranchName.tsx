import React from 'react'
import {cva} from 'class-variance-authority'
import {cn} from '../../internal/cn'

const branchNameVariants = cva(
  'inline-block max-w-full rounded-md bg-accent-muted px-1.5 py-0.5 font-mono text-xs leading-[18px] no-underline',
  {
    variants: {link: {true: 'text-accent', false: 'text-muted'}},
  },
)

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
      className={cn(branchNameVariants({link: Component === 'a'}), className)}
    />
  )
})

BranchName.displayName = 'BranchName'
