'use client'

import {Button as BaseButton} from '@base-ui/react/button'
import React from 'react'
import {mergeClassName} from './mergeClassName'

/**
 * Strips native button chrome so the button inherits its surroundings' typography and colour, matching
 * `@primer/react`'s internal `ButtonReset`. Only a focus ring is kept. The font longhands use labelled values so
 * `cn` lets a consumer's `font-semibold`, `font-mono` or `text-xs` replace them.
 */
export const unstyledButtonClassName =
  'm-0 inline-flex cursor-pointer appearance-none items-center border-0 bg-transparent p-0 text-start font-[family-name:inherit] text-[length:inherit] font-[number:inherit] leading-[inherit] text-inherit focus-visible:outline-2 focus-visible:outline-focus'

export type UnstyledButtonProps = React.ComponentPropsWithoutRef<typeof BaseButton>

/** Base UI button without Primer button styling, for controls embedded in other components' layouts. */
export const UnstyledButton = React.forwardRef<HTMLElement, UnstyledButtonProps>(function UnstyledButton(
  {className, type = 'button', ...props},
  ref,
) {
  return <BaseButton {...props} ref={ref} type={type} className={mergeClassName(unstyledButtonClassName, className)} />
})
