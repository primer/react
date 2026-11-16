import type React from 'react'
import {cn} from './cn'

/**
 * Story-only notice matching the deprecated upstream `Flash` that `@primer/react` stories still render, so
 * parity screenshots line up without shipping a deprecated component. Use `Banner` in product code.
 */
export function StoryNotice({className, ...rest}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...rest}
      className={cn(
        'relative rounded-md border-thin border-accent-muted bg-accent-muted p-4 text-default [&_p:last-child]:mb-0',
        className,
      )}
    />
  )
}
