import {cva} from 'class-variance-authority'

export const buttonBaseClassName =
  'inline-flex min-w-max appearance-none cursor-pointer select-none items-center justify-between gap-2 rounded-md border border-transparent py-0 [font-family:inherit] font-medium [line-height:normal] text-center no-underline transition-colors duration-[80ms] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:shadow-none aria-disabled:cursor-not-allowed aria-disabled:shadow-none'

export const buttonVariants = cva('', {
  variants: {
    variant: {
      default:
        'border-[var(--button-default-borderColor-rest)] bg-[var(--button-default-bgColor-rest)] text-[var(--button-default-fgColor-rest)] shadow-[var(--button-default-shadow-resting)] hover:border-[var(--button-default-borderColor-hover)] hover:bg-[var(--button-default-bgColor-hover)] active:border-[var(--button-default-borderColor-active)] active:bg-[var(--button-default-bgColor-active)] aria-expanded:border-[var(--button-default-borderColor-active)] aria-expanded:bg-[var(--button-default-bgColor-active)] disabled:border-[var(--button-default-borderColor-disabled)] disabled:bg-[var(--button-default-bgColor-disabled)] disabled:text-[var(--control-fgColor-disabled)]',
      primary:
        'border-[var(--button-primary-borderColor-rest)] bg-[var(--button-primary-bgColor-rest)] text-[var(--button-primary-fgColor-rest)] shadow-[var(--shadow-resting-small)] hover:border-[var(--button-primary-borderColor-hover)] hover:bg-[var(--button-primary-bgColor-hover)] active:bg-[var(--button-primary-bgColor-active)] aria-expanded:bg-[var(--button-primary-bgColor-active)] aria-expanded:shadow-[var(--button-primary-shadow-selected)] disabled:border-[var(--button-primary-borderColor-disabled)] disabled:bg-[var(--button-primary-bgColor-disabled)] disabled:text-[var(--button-primary-fgColor-disabled)]',
      danger:
        'border-[var(--button-default-borderColor-rest)] bg-[var(--button-danger-bgColor-rest)] text-[var(--button-danger-fgColor-rest)] shadow-[var(--button-default-shadow-resting)] hover:border-[var(--button-danger-borderColor-hover)] hover:bg-[var(--button-danger-bgColor-hover)] hover:text-[var(--button-danger-fgColor-hover)] active:border-[var(--button-danger-borderColor-active)] active:bg-[var(--button-danger-bgColor-active)] active:text-[var(--button-danger-fgColor-active)] aria-expanded:border-[var(--button-danger-borderColor-active)] aria-expanded:bg-[var(--button-danger-bgColor-active)] aria-expanded:text-[var(--button-danger-fgColor-active)] aria-expanded:shadow-[var(--button-danger-shadow-selected)] disabled:border-[var(--button-default-borderColor-disabled)] disabled:bg-[var(--button-danger-bgColor-disabled)] disabled:text-[var(--button-danger-fgColor-disabled)]',
      invisible:
        'border-[var(--button-invisible-borderColor-rest)] bg-transparent text-[var(--button-default-fgColor-rest)] shadow-none hover:border-[var(--button-invisible-borderColor-hover)] hover:bg-[var(--button-invisible-bgColor-hover)] active:bg-[var(--button-invisible-bgColor-active)] aria-expanded:bg-[var(--button-invisible-bgColor-active)] disabled:border-[var(--button-invisible-borderColor-disabled)] disabled:bg-[var(--button-invisible-bgColor-disabled)] disabled:text-[var(--button-invisible-fgColor-disabled)]',
      link: 'h-auto min-w-fit border-0 bg-transparent p-0 text-left text-[var(--fgColor-link)] shadow-none hover:underline disabled:bg-transparent disabled:text-[var(--control-fgColor-disabled)]',
    },
    size: {
      small: 'h-7 gap-1 px-2 text-xs',
      medium: 'h-8 px-3 text-sm',
      large: 'h-10 px-[var(--control-large-paddingInline-spacious)] text-sm',
    },
    block: {true: 'flex w-full', false: ''},
  },
  defaultVariants: {variant: 'default', size: 'medium', block: false},
})
