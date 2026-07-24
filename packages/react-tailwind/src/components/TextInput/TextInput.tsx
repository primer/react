import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

const inputVariants = cva(
  'block w-full rounded-md border border-default bg-default px-3 text-default shadow-resting-xs outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:bg-disabled disabled:text-muted focus:border-accent-emphasis focus:outline-2 focus:outline-offset-[-1px] focus:outline-focus aria-invalid:border-danger-emphasis',
  {
    variants: {size: {small: 'h-7 text-sm', medium: 'h-8 text-sm', large: 'h-10 text-base'}},
    defaultVariants: {size: 'medium'},
  },
)

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'data-component'>,
    VariantProps<typeof inputVariants> {}

/** A native text input with Primer field styling. */
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  {className, size, ...rest},
  ref,
) {
  return <input {...rest} ref={ref} data-component="TextInput" className={cn(inputVariants({size}), className)} />
})

TextInput.displayName = 'TextInput'
