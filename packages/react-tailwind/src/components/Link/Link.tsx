import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import type {BroadAsProps, PolymorphicPropsWithDefaultRef} from '../../utils/types/component'

const linkVariants = cva(
  'primer:text-accent primer:no-underline primer:underline-offset-[0.05rem] primer:hover:underline primer:[&:is(button)]:inline-block primer:[&:is(button)]:cursor-pointer primer:[&:is(button)]:select-none primer:[&:is(button)]:whitespace-nowrap primer:[&:is(button)]:border-0 primer:[&:is(button)]:bg-transparent primer:[&:is(button)]:p-0 primer:[&:is(button)]:text-[inherit] primer:[&:is(button)]:appearance-none',
  {
    variants: {
      muted: {true: 'primer:text-muted primer:hover:text-accent primer:hover:no-underline', false: ''},
      inline: {
        true: "primer:[[data-a11y-link-underlines='true']_&]:underline primer:[[data-a11y-link-underlines='true']_&]:hover:no-underline",
        false: '',
      },
    },
    defaultVariants: {muted: false, inline: false},
  },
)

interface LinkOwnProps extends VariantProps<typeof linkVariants> {
  /** Element to render. Use a non-anchor element when the link is handled by a router. */
  as?: React.ElementType
}

export type LinkProps<As extends React.ElementType = never> = PolymorphicPropsWithDefaultRef<
  As,
  LinkOwnProps,
  'a',
  HTMLElement
>

const LinkRoot = React.forwardRef<HTMLElement, LinkOwnProps & React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  function Link({as: Component = 'a', className, inline, muted, ...rest}, ref) {
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
  },
)

LinkRoot.displayName = 'Link'
export const Link = LinkRoot as {
  <As extends React.ElementType>(props: LinkProps<As> & {as: As}): React.ReactElement | null
  (props: LinkProps<'a'>): React.ReactElement | null
  <As extends React.ElementType>(props: BroadAsProps<As, LinkProps>): React.ReactElement | null
  displayName?: string
}
