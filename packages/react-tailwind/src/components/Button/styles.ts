import {cva} from 'class-variance-authority'

export const buttonBaseClassName =
  'inline-flex min-w-max appearance-none cursor-pointer items-center justify-between gap-2 rounded-md border border-transparent font-medium whitespace-nowrap transition-colors duration-[var(--base-duration-100)] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:shadow-none'

export const buttonVariants = cva('', {
  variants: {
    variant: {
      default:
        'border-[var(--button-default-borderColor-rest)] bg-[var(--button-default-bgColor-rest)] text-[var(--button-default-fgColor-rest)] shadow-[var(--button-default-shadow-resting)] hover:border-[var(--button-default-borderColor-hover)] hover:bg-[var(--button-default-bgColor-hover)] active:border-[var(--button-default-borderColor-active)] active:bg-[var(--button-default-bgColor-active)] disabled:border-[var(--button-default-borderColor-disabled)] disabled:bg-[var(--button-default-bgColor-disabled)] disabled:text-[var(--control-fgColor-disabled)]',
      primary:
        'border-[var(--button-primary-borderColor-rest)] bg-[var(--button-primary-bgColor-rest)] text-[var(--button-primary-fgColor-rest)] shadow-resting-sm hover:border-[var(--button-primary-borderColor-hover)] hover:bg-[var(--button-primary-bgColor-hover)] active:bg-[var(--button-primary-bgColor-active)] disabled:border-[var(--button-primary-borderColor-disabled)] disabled:bg-[var(--button-primary-bgColor-disabled)] disabled:text-[var(--button-primary-fgColor-disabled)]',
      danger:
        'border-[var(--button-default-borderColor-rest)] bg-[var(--button-danger-bgColor-rest)] text-[var(--button-danger-fgColor-rest)] shadow-[var(--button-default-shadow-resting)] hover:border-[var(--button-danger-borderColor-hover)] hover:bg-[var(--button-danger-bgColor-hover)] hover:text-[var(--button-danger-fgColor-hover)] active:border-[var(--button-danger-borderColor-active)] active:bg-[var(--button-danger-bgColor-active)] active:text-[var(--button-danger-fgColor-active)] disabled:border-[var(--button-default-borderColor-disabled)] disabled:bg-[var(--button-danger-bgColor-disabled)] disabled:text-[var(--button-danger-fgColor-disabled)]',
      invisible:
        'bg-transparent text-[var(--button-invisible-fgColor-rest)] hover:bg-[var(--button-invisible-bgColor-hover)] active:bg-[var(--button-invisible-bgColor-active)] disabled:text-[var(--button-invisible-fgColor-disabled)]',
    },
    size: {
      small: 'min-h-7 px-2 text-xs',
      medium: 'h-8 px-3 text-sm',
      large: 'h-10 px-[var(--control-large-paddingInline-spacious)] text-sm',
    },
    block: {true: 'flex w-full', false: ''},
  },
  defaultVariants: {variant: 'default', size: 'medium', block: false},
})
