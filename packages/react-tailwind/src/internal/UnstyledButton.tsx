'use client'

import {Button as BaseButton} from '@base-ui/react/button'
import React from 'react'
import {cn} from './cn'
import {mergeClassName} from './mergeClassName'

/**
 * Strips native button chrome and inherits typography and colour. The font longhands use labelled values so `cn`
 * lets a consumer's `font-semibold`, `font-mono` or `text-xs` replace them.
 */
export const unstyledButtonResetClassName =
  'primer:appearance-none primer:border-0 primer:bg-transparent primer:font-[family-name:inherit] primer:text-[length:inherit] primer:font-[number:inherit] primer:leading-[inherit] primer:text-inherit'

/** Unstyled button defaults for controls without their own layout and focus treatment. */
const unstyledButtonClassName = cn(
  'primer:m-0 primer:inline-flex primer:cursor-pointer primer:items-center primer:p-0 primer:text-start primer:focus-visible:outline-2 primer:focus-visible:outline-focus',
  unstyledButtonResetClassName,
)

export type UnstyledButtonProps = React.ComponentPropsWithoutRef<typeof BaseButton>

/** Base UI button without Primer button styling, for controls embedded in other components' layouts. */
export const UnstyledButton = React.forwardRef<HTMLElement, UnstyledButtonProps>(function UnstyledButton(
  {className, type = 'button', ...props},
  ref,
) {
  return <BaseButton {...props} ref={ref} type={type} className={mergeClassName(unstyledButtonClassName, className)} />
})
