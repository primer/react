import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

const linkVariants = cva(
  'text-accent underline decoration-accent/50 underline-offset-2 hover:decoration-current focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
  {
    variants: {muted: {true: 'text-muted', false: ''}, inline: {true: '', false: 'inline-block'}},
    defaultVariants: {muted: false, inline: true},
  },
)

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof linkVariants> {
  as?: React.ElementType
}

export const Link = React.forwardRef<HTMLElement, LinkProps>(function Link(
  {as: Component = 'a', className, inline, muted, ...rest},
  ref,
) {
  return (
    <Component {...rest} ref={ref} data-component="Link" className={cn(linkVariants({inline, muted}), className)} />
  )
})

Link.displayName = 'Link'
