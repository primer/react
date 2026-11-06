import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

const linkVariants = cva(
  'text-accent no-underline underline-offset-[0.05rem] hover:underline [&:is(button)]:inline-block [&:is(button)]:cursor-pointer [&:is(button)]:select-none [&:is(button)]:whitespace-nowrap [&:is(button)]:border-0 [&:is(button)]:bg-transparent [&:is(button)]:p-0 [&:is(button)]:text-[inherit] [&:is(button)]:appearance-none',
  {
    variants: {
      muted: {true: 'text-muted hover:text-accent hover:no-underline', false: ''},
      inline: {
        true: "[[data-a11y-link-underlines='true']_&]:underline [[data-a11y-link-underlines='true']_&]:hover:no-underline",
        false: '',
      },
    },
    defaultVariants: {muted: false, inline: false},
  },
)

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof linkVariants> {
  /** Element to render. Use a non-anchor element when the link is handled by a router. */
  as?: React.ElementType
}

export const Link = React.forwardRef<HTMLElement, LinkProps>(function Link(
  {as: Component = 'a', className, inline, muted, ...rest},
  ref,
) {
  return (
    <Component
      {...rest}
      ref={ref}
      data-component="Link"
      data-inline={inline || undefined}
      data-muted={muted || undefined}
      className={cn(linkVariants({inline, muted}), className)}
    />
  )
})

Link.displayName = 'Link'
