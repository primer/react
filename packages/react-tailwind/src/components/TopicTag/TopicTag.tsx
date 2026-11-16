import React from 'react'
import {cn} from '../../internal/cn'

const topicTagClassName =
  'primer:inline-flex primer:whitespace-nowrap primer:rounded-full primer:border-thin primer:border-[var(--topicTag-borderColor,transparent)] primer:bg-accent-muted primer:px-3 primer:py-0.5 primer:text-xs primer:font-semibold primer:leading-[var(--text-body-lineHeight-small)] primer:text-accent primer:no-underline primer:hover:bg-accent-emphasis primer:hover:text-on-emphasis primer:[&:is(a,button)]:cursor-pointer primer:[&:is(a,button)]:select-none'
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
      className={cn(
        'primer:flex primer:flex-wrap primer:gap-x-[var(--base-size-2)] primer:gap-y-[var(--base-size-8)]',
        className,
      )}
      data-component="TopicTagGroup"
    />
  )
})

export const TopicTag = Object.assign(TopicTagRoot, {Group: TopicTagGroup})
