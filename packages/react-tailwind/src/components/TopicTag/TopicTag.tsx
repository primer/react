import React from 'react'
import {cn} from '../../internal/cn'

const topicTagClassName =
  'inline-flex whitespace-nowrap rounded-full border border-[var(--topicTag-borderColor,transparent)] bg-accent-muted px-3 py-0.5 text-xs font-semibold leading-[var(--text-body-lineHeight-small)] text-accent no-underline hover:bg-accent-emphasis hover:text-on-emphasis [&:is(a,button)]:cursor-pointer [&:is(a,button)]:select-none'
export interface TopicTagProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. Use a non-anchor element when the tag does not link anywhere. */
  as?: React.ElementType
  /** URL the tag navigates to. */
  href?: string
}
const TopicTagRoot = React.forwardRef<HTMLElement, TopicTagProps>(function TopicTag(
  {as: Component = 'a', className, href, ...rest},
  ref,
) {
  return (
    <Component {...rest} ref={ref} href={href} className={cn(topicTagClassName, className)} data-component="TopicTag" />
  )
})
export type TopicTagGroupProps = React.ComponentPropsWithoutRef<'div'>
export const TopicTagGroup = React.forwardRef<HTMLDivElement, TopicTagGroupProps>(function TopicTagGroup(
  {className, ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cn('flex flex-wrap gap-x-[var(--base-size-2)] gap-y-[var(--base-size-8)]', className)}
      data-component="TopicTagGroup"
    />
  )
})

export const TopicTag = Object.assign(TopicTagRoot, {Group: TopicTagGroup})
