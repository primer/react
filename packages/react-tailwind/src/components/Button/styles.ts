import {cva} from 'class-variance-authority'

// Mirrors Primer's ButtonBase cascade. Disabled styles cover `disabled` and `aria-disabled`, but not a loading button,
// which keeps its variant colors. Arbitrary variants sort after named ones, so the disabled classes outrank hover,
// pressed and expanded states. The focus ring is inset and replaces the resting shadow.
export const buttonBaseClassName =
  'flex [&[href]]:inline-flex min-w-max appearance-none cursor-pointer select-none items-center justify-between gap-2 rounded-md border border-transparent py-0 [font-family:inherit] font-medium [line-height:normal] text-center no-underline transition-[color,fill,background-color,border-color] duration-[80ms] ease-[cubic-bezier(0.65,0,0.35,1)] active:transition-none motion-reduce:transition-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus focus-visible:shadow-none [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:cursor-not-allowed [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:shadow-none [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:[--button-visual-fgColor:currentColor]'

export const buttonVariants = cva('', {
  variants: {
    variant: {
      default:
        'border-[var(--button-default-borderColor-rest)] bg-[var(--button-default-bgColor-rest)] text-[var(--button-default-fgColor-rest)] shadow-[var(--button-default-shadow-resting)] [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:border-[var(--button-default-borderColor-disabled)] [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:bg-[var(--button-default-bgColor-disabled)] [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:text-[var(--control-fgColor-disabled)]',
      primary:
        '[--button-visual-fgColor:var(--button-primary-fgColor-rest)] border-[var(--button-primary-borderColor-rest)] bg-[var(--button-primary-bgColor-rest)] text-[var(--button-primary-fgColor-rest)] shadow-[var(--shadow-resting-small)] focus-visible:shadow-[inset_0_0_0_3px_var(--fgColor-onEmphasis)] aria-expanded:focus-visible:shadow-[inset_0_0_0_3px_var(--fgColor-onEmphasis)] [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:border-[var(--button-primary-borderColor-disabled)] [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:bg-[var(--button-primary-bgColor-disabled)] [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:text-[var(--button-primary-fgColor-disabled)]',
      danger:
        '[--button-visual-fgColor:var(--button-danger-iconColor-rest)] border-[var(--button-default-borderColor-rest)] bg-[var(--button-danger-bgColor-rest)] text-[var(--button-danger-fgColor-rest)] shadow-[var(--button-default-shadow-resting)] [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:border-[var(--button-default-borderColor-disabled)] [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:bg-[var(--button-danger-bgColor-disabled)] [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:text-[var(--button-danger-fgColor-disabled)]',
      invisible:
        '[--button-visual-fgColor:var(--button-invisible-iconColor-rest)] border-[var(--button-invisible-borderColor-rest)] bg-transparent text-[var(--button-default-fgColor-rest)] shadow-none [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:border-[var(--button-invisible-borderColor-disabled)] [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:bg-[var(--button-invisible-bgColor-disabled)] [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:text-[var(--button-invisible-fgColor-disabled)]',
      link: '[--button-visual-fgColor:var(--fgColor-link)] bg-transparent text-left text-[var(--fgColor-link)] shadow-none focus-visible:outline-offset-2 [&[data-no-visuals]:hover:not(:disabled,[aria-disabled=true],[data-inactive])]:underline [&:not([data-no-visuals]):hover:not(:disabled,[aria-disabled=true],[data-inactive])_[data-component=text]]:underline [&:not([data-no-visuals])_[data-component=text]]:underline-offset-2 [[data-a11y-link-underlines=true]_&[data-no-visuals]]:underline [[data-a11y-link-underlines=true]_&[data-no-visuals]:hover:not(:disabled,[aria-disabled=true],[data-inactive])]:no-underline [[data-a11y-link-underlines=true]_&:not([data-no-visuals])_[data-component=text]]:underline [[data-a11y-link-underlines=true]_&:not([data-no-visuals]):hover:not(:disabled,[aria-disabled=true],[data-inactive])_[data-component=text]]:no-underline [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:border-transparent [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:bg-transparent [&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:text-[var(--control-fgColor-disabled)]',
    },
    size: {
      small: 'h-7 gap-1 px-2 text-xs',
      medium: 'h-8 px-3 text-sm',
      large: 'h-10 px-[var(--control-large-paddingInline-spacious)] text-sm',
    },
    block: {true: 'w-full', false: ''},
    // An inactive button looks unavailable but stays focusable and clickable, so it skips hover, pressed and expanded
    // feedback.
    inactive: {
      true: 'cursor-auto border-[var(--button-inactive-bgColor)] bg-[var(--button-inactive-bgColor)] text-[var(--button-inactive-fgColor)] shadow-none [--button-visual-fgColor:currentColor]!',
      false: '',
    },
  },
  compoundVariants: [
    {
      variant: 'default',
      inactive: false,
      className:
        'aria-expanded:border-[var(--button-default-borderColor-active)] aria-expanded:bg-[var(--button-default-bgColor-active)] hover:border-[var(--button-default-borderColor-hover)] hover:bg-[var(--button-default-bgColor-hover)] active:border-[var(--button-default-borderColor-active)] active:bg-[var(--button-default-bgColor-active)] aria-expanded:hover:border-[var(--button-default-borderColor-hover)] aria-expanded:hover:bg-[var(--button-default-bgColor-hover)] aria-expanded:active:border-[var(--button-default-borderColor-active)] aria-expanded:active:bg-[var(--button-default-bgColor-active)]',
    },
    {
      variant: 'primary',
      inactive: false,
      className:
        'aria-expanded:bg-[var(--button-primary-bgColor-active)] aria-expanded:shadow-[var(--button-primary-shadow-selected)] hover:border-[var(--button-primary-borderColor-hover)] hover:bg-[var(--button-primary-bgColor-hover)] active:bg-[var(--button-primary-bgColor-active)] active:shadow-[var(--button-primary-shadow-selected)] aria-expanded:hover:border-[var(--button-primary-borderColor-hover)] aria-expanded:hover:bg-[var(--button-primary-bgColor-hover)] aria-expanded:active:bg-[var(--button-primary-bgColor-active)] aria-expanded:active:shadow-[var(--button-primary-shadow-selected)]',
    },
    {
      variant: 'danger',
      inactive: false,
      className:
        'aria-expanded:[--button-visual-fgColor:var(--button-danger-iconColor-hover)] aria-expanded:border-[var(--button-danger-borderColor-active)] aria-expanded:bg-[var(--button-danger-bgColor-active)] aria-expanded:text-[var(--button-danger-fgColor-active)] aria-expanded:shadow-[var(--button-danger-shadow-selected)] hover:[--button-visual-fgColor:var(--button-danger-iconColor-hover)] hover:border-[var(--button-danger-borderColor-hover)] hover:bg-[var(--button-danger-bgColor-hover)] hover:text-[var(--button-danger-fgColor-hover)] hover:shadow-[var(--shadow-resting-small)] active:[--button-visual-fgColor:var(--button-danger-iconColor-hover)] active:border-[var(--button-danger-borderColor-active)] active:bg-[var(--button-danger-bgColor-active)] active:text-[var(--button-danger-fgColor-active)] active:shadow-[var(--button-danger-shadow-selected)] aria-expanded:hover:border-[var(--button-danger-borderColor-hover)] aria-expanded:hover:bg-[var(--button-danger-bgColor-hover)] aria-expanded:hover:text-[var(--button-danger-fgColor-hover)] aria-expanded:hover:shadow-[var(--shadow-resting-small)] aria-expanded:active:border-[var(--button-danger-borderColor-active)] aria-expanded:active:bg-[var(--button-danger-bgColor-active)] aria-expanded:active:text-[var(--button-danger-fgColor-active)] aria-expanded:active:shadow-[var(--button-danger-shadow-selected)]',
    },
    {
      variant: 'invisible',
      inactive: false,
      className:
        'aria-expanded:bg-[var(--button-invisible-bgColor-active)] hover:[--button-visual-fgColor:var(--button-invisible-iconColor-hover)] hover:border-[var(--button-invisible-borderColor-hover)] hover:bg-[var(--button-invisible-bgColor-hover)] active:[--button-visual-fgColor:var(--button-invisible-iconColor-hover)] active:bg-[var(--button-invisible-bgColor-active)] aria-expanded:hover:bg-[var(--button-invisible-bgColor-hover)] aria-expanded:active:bg-[var(--button-invisible-bgColor-active)]',
    },
    {variant: 'link', className: 'inline-flex h-auto min-w-fit rounded-none border-0 p-0 [font-size:inherit]'},
    {variant: 'link', inactive: true, className: 'bg-transparent'},
  ],
  defaultVariants: {variant: 'default', size: 'medium', block: false, inactive: false},
})
