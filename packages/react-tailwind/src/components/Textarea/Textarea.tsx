import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

const textareaVariants = cva(
  'block w-full rounded-md border border-default bg-default px-3 py-2 text-sm text-default shadow-resting-xs outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:bg-disabled disabled:text-muted focus:border-accent-emphasis focus:outline-2 focus:outline-offset-[-1px] focus:outline-focus aria-invalid:border-danger-emphasis',
  {
    variants: {resize: {none: 'resize-none', vertical: 'resize-y', horizontal: 'resize-x', both: 'resize'}},
    defaultVariants: {resize: 'vertical'},
  },
)

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'data-component'>,
    VariantProps<typeof textareaVariants> {}

/** A native multiline text control with Primer field styling. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {className, resize, rows = 4, ...rest},
  ref,
) {
  return (
    <textarea
      {...rest}
      ref={ref}
      rows={rows}
      data-component="Textarea"
      className={cn(textareaVariants({resize}), className)}
    />
  )
})

Textarea.displayName = 'Textarea'
