import {CheckIcon} from '@primer/octicons-react'
import React from 'react'
import {cn} from './cn'

/*
 * Visuals shared by `Checkbox`, `Radio`, and the selection indicators of selectable list rows.
 * The control classes key on Base UI's `data-checked`, `data-indeterminate`, and `data-disabled`
 * state attributes, so a decorative row indicator matches a control by setting the same attributes.
 */

const controlBoxClassName =
  'primer:grid primer:size-4 primer:shrink-0 primer:place-items-center primer:border-thin primer:border-[var(--control-borderColor-emphasis)] primer:bg-default primer:transition-colors primer:duration-80 primer:ease-[cubic-bezier(0.33,1,0.68,1)] primer:data-[checked]:ease-[cubic-bezier(0.32,0,0.67,0)] primer:motion-reduce:transition-none primer:data-[disabled]:border-[var(--control-borderColor-disabled)] primer:data-[disabled]:bg-[var(--control-bgColor-disabled)]'

// Interactive controls carry upstream's 2px top margin, which centres them on a 20px label line.
const controlInputClassName =
  'primer:mt-0.5 primer:cursor-pointer primer:data-[disabled]:cursor-not-allowed primer:focus-visible:outline-2 primer:focus-visible:outline-offset-2 primer:focus-visible:outline-focus'

const checkboxBoxClassName = `${controlBoxClassName} primer:rounded-sm primer:text-[var(--control-checked-fgColor-rest)] primer:data-[checked]:bg-[var(--control-checked-bgColor-rest)] primer:data-[indeterminate]:border-[var(--control-checked-bgColor-rest)] primer:data-[indeterminate]:bg-[var(--control-checked-bgColor-rest)] primer:data-[checked]:data-[disabled]:border-[var(--control-checked-borderColor-disabled)] primer:data-[checked]:data-[disabled]:bg-[var(--control-checked-bgColor-disabled)] primer:data-[checked]:data-[disabled]:text-[var(--control-checked-fgColor-disabled)] primer:data-[indeterminate]:data-[disabled]:border-[var(--control-checked-borderColor-disabled)] primer:data-[indeterminate]:data-[disabled]:bg-[var(--control-checked-bgColor-disabled)] primer:data-[indeterminate]:data-[disabled]:text-[var(--control-checked-fgColor-disabled)] primer:forced-colors:data-[checked]:border-[CanvasText] primer:forced-colors:data-[checked]:bg-[CanvasText] primer:forced-colors:data-[indeterminate]:border-[CanvasText] primer:forced-colors:data-[indeterminate]:bg-[CanvasText]`

/** Classes for the `Checkbox` root. Its checked border uses the background token so it doesn't change in high contrast themes. */
export const checkboxClassName = `${checkboxBoxClassName} ${controlInputClassName} primer:data-[checked]:border-[var(--control-checked-bgColor-rest)]`

/** Classes for the `Radio` root, also used by radio row indicators. */
export const radioClassName = `${controlBoxClassName} ${controlInputClassName} primer:rounded-full primer:data-[checked]:border-thicker primer:data-[checked]:border-[var(--control-checked-bgColor-rest)] primer:data-[checked]:bg-[var(--control-checked-fgColor-rest)] primer:data-[checked]:data-[disabled]:border-[var(--control-checked-bgColor-disabled)] primer:data-[checked]:data-[disabled]:bg-[var(--control-checked-fgColor-disabled)] primer:forced-colors:data-[checked]:border-[CanvasText] primer:forced-colors:data-[checked]:bg-[Canvas]`

/** Reveals a checkbox glyph from the bottom up, as upstream's check animation does. */
export const checkboxGlyphRevealClassName =
  'primer:motion-safe:transition-[clip-path] primer:motion-safe:duration-80 primer:motion-safe:ease-[cubic-bezier(0.65,0,0.35,1)] primer:motion-reduce:transition-none'
const checkboxGlyphHiddenClassName = 'primer:[clip-path:inset(var(--base-size-16)_0_0_0)]'

export interface CheckboxGlyphProps {
  className?: string
  /** Draws the dash of a partially selected checkbox instead of the check. */
  indeterminate?: boolean
}

/**
 * The check or dash drawn inside a checkbox. Upstream masks these paths at 75% of a 16px box, so
 * drawing them 12px wide centres them in the same place.
 */
export function CheckboxGlyph({className, indeterminate = false}: CheckboxGlyphProps) {
  return indeterminate ? (
    <svg
      aria-hidden="true"
      className={cn('primer:shrink-0 primer:forced-colors:text-[Canvas]', className)}
      fill="currentColor"
      focusable="false"
      height="2.4"
      viewBox="0 0 10 2"
      width="12"
    >
      <path d="M0 1C0 0.447715 0.447715 0 1 0H9C9.55229 0 10 0.447715 10 1C10 1.55228 9.55229 2 9 2H1C0.447715 2 0 1.55228 0 1Z" />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      className={cn('primer:shrink-0 primer:forced-colors:text-[Canvas]', className)}
      fill="currentColor"
      focusable="false"
      height="9"
      viewBox="0 0 12 9"
      width="12"
    >
      <path
        clipRule="evenodd"
        d="M11.7803 0.219625C11.921 0.360427 12 0.551305 12 0.750313C12 0.949321 11.921 1.14019 11.7803 1.281L4.5186 8.54042C4.37775 8.681 4.18682 8.76 3.98774 8.76C3.78867 8.76 3.59773 8.681 3.45689 8.54042L0.201622 5.2862C0.0689277 5.14383 -0.00330905 4.95555 0.000116493 4.76098C0.00355205 4.56643 0.0823894 4.38081 0.220032 4.24321C0.357665 4.10562 0.543355 4.02681 0.73797 4.02338C0.932584 4.01994 1.12093 4.09217 1.26334 4.22482L3.98774 6.94835L10.7186 0.219625C10.8595 0.0789923 11.0504 0 11.2495 0C11.4485 0 11.6395 0.0789923 11.7803 0.219625Z"
        fillRule="evenodd"
      />
    </svg>
  )
}

export type SelectionVisualVariant = 'single' | 'radio' | 'multiple'

export interface SelectionVisualProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'children'> {
  /** Whether the row is selected. */
  checked: boolean
  /** Draws the disabled control colours. */
  disabled?: boolean
  /** Draws the mixed state of a multiple-selection indicator. */
  indeterminate?: boolean
  /** `multiple` draws a checkbox, `radio` a radio, and `single` a checkmark. */
  variant: SelectionVisualVariant
}

/**
 * The decorative selection indicator of a selectable list row. The row carries the selection
 * semantics, so the indicator is hidden from assistive technology.
 */
export const SelectionVisual = React.forwardRef<HTMLSpanElement, SelectionVisualProps>(function SelectionVisual(
  {checked, className, disabled = false, indeterminate = false, variant, ...rest},
  ref,
) {
  const stateAttributes = {
    'data-checked': checked ? '' : undefined,
    'data-disabled': disabled ? '' : undefined,
    'data-indeterminate': variant === 'multiple' && indeterminate ? '' : undefined,
  }

  if (variant === 'single') {
    return (
      <span
        {...rest}
        {...stateAttributes}
        ref={ref}
        aria-hidden="true"
        className={cn('primer:flex primer:shrink-0', className)}
      >
        <CheckIcon className={cn('primer:shrink-0', !checked && 'primer:invisible')} />
      </span>
    )
  }

  if (variant === 'radio') {
    return (
      <span {...rest} {...stateAttributes} ref={ref} aria-hidden="true" className={cn(radioClassName, className)} />
    )
  }

  return (
    <span
      {...rest}
      {...stateAttributes}
      ref={ref}
      aria-hidden="true"
      // Row checkboxes use the border token, which differs from the background in high contrast themes.
      className={cn(
        checkboxBoxClassName,
        'primer:data-[checked]:border-[var(--control-checked-borderColor-rest)]',
        className,
      )}
    >
      <CheckboxGlyph
        className={cn(
          checkboxGlyphRevealClassName,
          checked || indeterminate ? 'primer:motion-safe:delay-80' : checkboxGlyphHiddenClassName,
        )}
        indeterminate={indeterminate}
      />
    </span>
  )
})

SelectionVisual.displayName = 'SelectionVisual'
