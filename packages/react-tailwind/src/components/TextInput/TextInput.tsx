import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

const inputVariants = cva(
  'block m-0 appearance-none rounded-md border border-[var(--control-borderColor-rest)] bg-default text-default shadow-[var(--shadow-inset)] outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:border-[var(--control-borderColor-disabled)] disabled:bg-[var(--control-bgColor-disabled)] disabled:text-disabled disabled:shadow-none focus:border-accent-emphasis focus:outline-2 focus:outline-offset-[-1px] focus:outline-focus aria-invalid:border-danger-emphasis aria-invalid:focus:border-[var(--control-borderColor-danger)] aria-invalid:focus:outline-[var(--control-borderColor-danger)]',
  {
    variants: {
      size: {
        small: 'h-7 px-2 text-xs leading-5',
        medium: 'h-8 px-3 text-sm leading-5',
        large: 'h-10 px-2 text-sm leading-5',
      },
    },
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
