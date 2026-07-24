import {cva} from 'class-variance-authority'

export const buttonBaseClassName =
  'inline-flex items-center justify-center gap-2 rounded-md border border-transparent font-semibold whitespace-nowrap transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:text-disabled'

export const buttonVariants = cva('', {
  variants: {
    variant: {
      default: 'border-default bg-default text-default hover:bg-muted active:bg-inset',
      primary: 'bg-accent-emphasis text-on-emphasis hover:bg-accent-emphasis active:bg-accent-emphasis',
      danger: 'bg-danger-emphasis text-on-emphasis hover:bg-danger-emphasis active:bg-danger-emphasis',
      invisible: 'bg-transparent text-accent hover:bg-accent-muted active:bg-accent-muted',
    },
    size: {
      small: 'min-h-7 px-2 text-xs',
      medium: 'min-h-8 px-3 text-sm',
      large: 'min-h-10 px-3 text-sm',
    },
    block: {true: 'flex w-full', false: ''},
  },
  defaultVariants: {variant: 'default', size: 'medium', block: false},
})
