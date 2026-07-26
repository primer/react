import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

const headingVariants = cva('m-0 font-display text-default', {
  variants: {
    size: {small: 'text-title-small', medium: 'text-title-medium', large: 'text-title-large', display: 'text-display'},
  },
  defaultVariants: {size: 'large'},
})

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  {as: Component = 'h2', className, size, ...rest},
  ref,
) {
  return <Component {...rest} ref={ref} data-component="Heading" className={cn(headingVariants({size}), className)} />
})

Heading.displayName = 'Heading'
