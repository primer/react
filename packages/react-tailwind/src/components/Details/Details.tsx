import React from 'react'
import {cn} from '../../internal/cn'

export type DetailsProps = Omit<React.DetailsHTMLAttributes<HTMLDetailsElement>, 'data-component'>

const Root = React.forwardRef<HTMLDetailsElement, DetailsProps>(function Details({className, ...rest}, ref) {
  return (
    <details
      {...rest}
      ref={ref}
      data-component="Details"
      className={cn('[&>summary]:list-none [&>summary::-webkit-details-marker]:hidden', className)}
    />
  )
})

export type DetailsSummaryProps = Omit<React.HTMLAttributes<HTMLElement>, 'data-component'>

const Summary = React.forwardRef<HTMLElement, DetailsSummaryProps>(function Summary({className, ...rest}, ref) {
  return (
    <summary
      {...rest}
      ref={ref}
      data-component="Details.Summary"
      className={cn('list-none [&::-webkit-details-marker]:hidden', className)}
    />
  )
})

/** Native disclosure. Summary must be the first child. */
export const Details = Object.assign(Root, {Summary})
