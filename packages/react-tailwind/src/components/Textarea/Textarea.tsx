'use client'

import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import {useFormControlForwardedProps} from '../FormControl/useFormControlForwardedProps'

const textareaVariants = cva(
  'block m-0 appearance-none rounded-md border border-[var(--control-borderColor-rest)] bg-default p-3 text-sm [line-height:normal] text-default shadow-[var(--shadow-inset)] outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:border-[var(--control-borderColor-disabled)] disabled:bg-[var(--control-bgColor-disabled)] disabled:text-disabled disabled:shadow-none focus:border-accent-emphasis focus:outline-2 focus:outline-offset-[-1px] focus:outline-focus aria-invalid:border-danger-emphasis aria-invalid:focus:border-[var(--control-borderColor-danger)] aria-invalid:focus:outline-[var(--control-borderColor-danger)]',
  {
    variants: {resize: {none: 'resize-none', vertical: 'resize-y', horizontal: 'resize-x', both: 'resize'}},
    defaultVariants: {resize: 'both'},
  },
)

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'data-component'>,
    VariantProps<typeof textareaVariants> {}

/** A native multiline text control with Primer field styling. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {className, cols = 30, resize, rows = 7, ...rest},
  ref,
) {
  const forwardedProps = useFormControlForwardedProps(rest)
  return (
    <textarea
      {...forwardedProps}
      ref={ref}
      cols={cols}
      rows={rows}
      data-component="Textarea"
      className={cn(textareaVariants({resize}), className)}
    />
  )
})

Textarea.displayName = 'Textarea'
