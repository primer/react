'use client'

import {cva} from 'class-variance-authority'
import React from 'react'
import {CharacterCounter} from '../../internal/CharacterCounter'
import {useCharacterLimit} from '../../internal/useCharacterLimit'
import {cn} from '../../internal/cn'
import {markFormControlInput} from '../../internal/formControlParts'
import {joinIdRefs} from '../../internal/idRefs'
import {useFormControlForwardedProps, useFormControlValidationStatus} from '../FormControl/useFormControlForwardedProps'

const textareaVariants = cva(
  'block m-0 appearance-none rounded-md border border-[var(--control-borderColor-rest)] bg-default p-3 text-sm [line-height:normal] text-default shadow-[var(--shadow-inset)] placeholder:text-muted disabled:cursor-not-allowed disabled:resize-none disabled:border-[var(--control-borderColor-disabled)] disabled:bg-[var(--control-bgColor-disabled)] disabled:text-disabled disabled:shadow-none focus:border-accent-emphasis focus:outline-2 focus:outline-offset-[-1px] focus:outline-[var(--borderColor-accent-emphasis)] data-[validation=success]:border-[var(--bgColor-success-emphasis)] aria-invalid:border-danger-emphasis aria-invalid:focus:border-[var(--control-borderColor-danger)] aria-invalid:focus:outline-[var(--control-borderColor-danger)]',
  {
    variants: {
      autoSize: {true: '[field-sizing:content]', false: ''},
      block: {true: 'w-full', false: ''},
      resize: {none: 'resize-none', vertical: 'resize-y', horizontal: 'resize-x', both: 'resize'},
    },
    defaultVariants: {autoSize: false, block: false, resize: 'both'},
  },
)

// Primer measures min/max height inside the control border (its wrapper owns the border), so add our 1px `border` on both edges.
const withBorder = (size: number | undefined) => (size === undefined ? undefined : size + 2)

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'data-component'> {
  /** Grows the textarea to fit its content, using CSS `field-sizing`. */
  autoSize?: boolean
  /** Stretches the textarea to fill the width of its container. */
  block?: boolean
  /** Shows a remaining-character count and announces when the limit is near. */
  characterLimit?: number
  /** Maximum height of the textarea, in pixels. */
  maxHeight?: number
  /** Minimum height of the textarea, in pixels. */
  minHeight?: number
  /** Which directions the user can resize the textarea in. */
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
  /** Applies error or success styling. Going over `characterLimit` always shows the error state. */
  validationStatus?: 'error' | 'success'
}

/** A native multiline text control with Primer field styling. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    autoSize = false,
    block = false,
    characterLimit,
    className,
    cols = 30,
    defaultValue,
    maxHeight,
    minHeight,
    onChange,
    resize,
    rows = 7,
    style,
    validationStatus,
    value,
    ...rest
  },
  ref,
) {
  const forwardedProps = useFormControlForwardedProps(rest)
  const {characterLimitId, counter, onValueChange} = useCharacterLimit({characterLimit, defaultValue, value})
  const fieldValidationStatus = useFormControlValidationStatus()
  const effectiveValidation =
    counter?.isOverLimit || forwardedProps['aria-invalid'] ? 'error' : (validationStatus ?? fieldValidationStatus)
  const describedBy = joinIdRefs(forwardedProps['aria-describedby'], characterLimitId)

  return (
    <>
      <textarea
        {...forwardedProps}
        ref={ref}
        aria-describedby={describedBy}
        aria-invalid={effectiveValidation === 'error' ? true : forwardedProps['aria-invalid']}
        className={cn(textareaVariants({autoSize, block, resize}), className)}
        cols={cols}
        data-auto-size={autoSize || undefined}
        data-block={block || undefined}
        data-component="Textarea"
        data-resize={resize}
        data-validation={effectiveValidation}
        defaultValue={defaultValue}
        onChange={event => {
          onValueChange(event.target.value)
          onChange?.(event)
        }}
        rows={rows}
        style={
          minHeight === undefined && maxHeight === undefined
            ? style
            : {minHeight: withBorder(minHeight), maxHeight: withBorder(maxHeight), ...style}
        }
        value={value}
      />
      {counter && characterLimit !== undefined && characterLimitId ? (
        <CharacterCounter
          characterLimit={characterLimit}
          counter={counter}
          data-component="Textarea.CharacterCounter"
          id={characterLimitId}
        />
      ) : null}
    </>
  )
})

Textarea.displayName = 'Textarea'

markFormControlInput(Textarea)
