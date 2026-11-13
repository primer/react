import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

const headingVariants = cva('primer:m-0 primer:font-display primer:text-default', {
  variants: {
    size: {
      small: 'primer:text-title-small',
      medium: 'primer:text-title-medium',
      large: 'primer:text-title-large',
      display: 'primer:text-display',
    },
  },
  defaultVariants: {size: 'large'},
})

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  /** Heading element to render, so the level fits the surrounding document outline independently of its size. */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  {as: Component = 'h2', className, size, ...rest},
  ref,
) {
  return <Component {...rest} ref={ref} data-component="Heading" className={cn(headingVariants({size}), className)} />
})

Heading.displayName = 'Heading'
