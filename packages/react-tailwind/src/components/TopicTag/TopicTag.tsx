import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

const topicTag = cva(
  'inline-flex whitespace-nowrap rounded-full border border-transparent bg-accent-muted px-3 py-0.5 text-sm font-semibold leading-5 text-accent no-underline',
  {
    variants: {interactive: {true: 'cursor-pointer hover:bg-accent-emphasis hover:text-on-emphasis', false: ''}},
    defaultVariants: {interactive: true},
  },
)
export interface TopicTagProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  href?: string
}
export const TopicTag = React.forwardRef<HTMLElement, TopicTagProps>(function TopicTag(
  {as, className, href, ...rest},
  ref,
) {
  const Component = as ?? 'a'
  return (
    <Component
      {...rest}
      ref={ref}
      href={href}
      className={cn(topicTag({interactive: Component === 'a' || Component === 'button'}), className)}
      data-component="TopicTag"
    />
  )
})
export type TopicTagGroupProps = React.ComponentPropsWithoutRef<'div'>
export const TopicTagGroup = React.forwardRef<HTMLDivElement, TopicTagGroupProps>(function TopicTagGroup(
  {className, ...rest},
  ref,
) {
  return <div {...rest} ref={ref} className={cn('flex flex-wrap gap-2', className)} data-component="TopicTagGroup" />
})
