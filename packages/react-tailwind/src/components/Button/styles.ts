import {cva} from 'class-variance-authority'

// Mirrors Primer's ButtonBase cascade. Disabled styles cover `disabled` and `aria-disabled`, but not a loading button,
// which keeps its variant colors. Arbitrary variants sort after named ones, so the disabled classes outrank hover,
// pressed and expanded states. The focus ring is inset and replaces the resting shadow.
export const buttonBaseClassName =
  'primer:flex primer:[&[href]]:inline-flex primer:min-w-max primer:appearance-none primer:cursor-pointer primer:select-none primer:items-center primer:justify-between primer:gap-2 primer:rounded-md primer:border-thin primer:border-transparent primer:py-0 primer:[font-family:inherit] primer:font-medium primer:[line-height:normal] primer:text-center primer:no-underline primer:transition-[color,fill,background-color,border-color] primer:duration-[80ms] primer:ease-[cubic-bezier(0.65,0,0.35,1)] primer:active:transition-none primer:motion-reduce:transition-none primer:focus-visible:outline-2 primer:focus-visible:-outline-offset-2 primer:focus-visible:outline-focus primer:focus-visible:shadow-none primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:cursor-not-allowed primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:shadow-none primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:[--button-visual-fgColor:currentColor]'

export const buttonVariants = cva('', {
  variants: {
    variant: {
      default:
        'primer:border-[var(--button-default-borderColor-rest)] primer:bg-[var(--button-default-bgColor-rest)] primer:text-[var(--button-default-fgColor-rest)] primer:shadow-[var(--button-default-shadow-resting)] primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:border-[var(--button-default-borderColor-disabled)] primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:bg-[var(--button-default-bgColor-disabled)] primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:text-[var(--control-fgColor-disabled)]',
      primary:
        'primer:[--button-visual-fgColor:var(--button-primary-fgColor-rest)] primer:border-[var(--button-primary-borderColor-rest)] primer:bg-[var(--button-primary-bgColor-rest)] primer:text-[var(--button-primary-fgColor-rest)] primer:shadow-[var(--shadow-resting-small)] primer:focus-visible:shadow-[inset_0_0_0_3px_var(--fgColor-onEmphasis)] primer:aria-expanded:focus-visible:shadow-[inset_0_0_0_3px_var(--fgColor-onEmphasis)] primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:border-[var(--button-primary-borderColor-disabled)] primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:bg-[var(--button-primary-bgColor-disabled)] primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:text-[var(--button-primary-fgColor-disabled)]',
      danger:
        'primer:[--button-visual-fgColor:var(--button-danger-iconColor-rest)] primer:border-[var(--button-default-borderColor-rest)] primer:bg-[var(--button-danger-bgColor-rest)] primer:text-[var(--button-danger-fgColor-rest)] primer:shadow-[var(--button-default-shadow-resting)] primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:border-[var(--button-default-borderColor-disabled)] primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:bg-[var(--button-danger-bgColor-disabled)] primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:text-[var(--button-danger-fgColor-disabled)]',
      invisible:
        'primer:[--button-visual-fgColor:var(--button-invisible-iconColor-rest)] primer:border-[var(--button-invisible-borderColor-rest)] primer:bg-transparent primer:text-[var(--button-default-fgColor-rest)] primer:shadow-none primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:border-[var(--button-invisible-borderColor-disabled)] primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:bg-[var(--button-invisible-bgColor-disabled)] primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:text-[var(--button-invisible-fgColor-disabled)]',
      link: 'primer:[--button-visual-fgColor:var(--fgColor-link)] primer:bg-transparent primer:text-left primer:text-[var(--fgColor-link)] primer:shadow-none primer:focus-visible:outline-offset-2 primer:[&[data-no-visuals]:hover:not(:disabled,[aria-disabled=true],[data-inactive])]:underline primer:[&:not([data-no-visuals]):hover:not(:disabled,[aria-disabled=true],[data-inactive])_[data-component=text]]:underline primer:[&:not([data-no-visuals])_[data-component=text]]:underline-offset-2 primer:[[data-a11y-link-underlines=true]_&[data-no-visuals]]:underline primer:[[data-a11y-link-underlines=true]_&[data-no-visuals]:hover:not(:disabled,[aria-disabled=true],[data-inactive])]:no-underline primer:[[data-a11y-link-underlines=true]_&:not([data-no-visuals])_[data-component=text]]:underline primer:[[data-a11y-link-underlines=true]_&:not([data-no-visuals]):hover:not(:disabled,[aria-disabled=true],[data-inactive])_[data-component=text]]:no-underline primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:border-transparent primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:bg-transparent primer:[&:is(:disabled,[aria-disabled=true]:not([data-loading=true]))]:text-[var(--control-fgColor-disabled)]',
    },
    size: {
      small: 'primer:h-7 primer:gap-1 primer:px-2 primer:text-xs',
      medium: 'primer:h-8 primer:px-3 primer:text-sm',
      large: 'primer:h-10 primer:px-[var(--control-large-paddingInline-spacious)] primer:text-sm',
    },
    block: {true: 'primer:w-full', false: ''},
    // An inactive button looks unavailable but stays focusable and clickable, so it skips hover, pressed and expanded
    // feedback.
    inactive: {
      true: 'primer:cursor-auto primer:border-[var(--button-inactive-bgColor)] primer:bg-[var(--button-inactive-bgColor)] primer:text-[var(--button-inactive-fgColor)] primer:shadow-none primer:[--button-visual-fgColor:currentColor]!',
      false: '',
    },
  },
  compoundVariants: [
    {
      variant: 'default',
      inactive: false,
      className:
        'primer:aria-expanded:border-[var(--button-default-borderColor-active)] primer:aria-expanded:bg-[var(--button-default-bgColor-active)] primer:hover:border-[var(--button-default-borderColor-hover)] primer:hover:bg-[var(--button-default-bgColor-hover)] primer:active:border-[var(--button-default-borderColor-active)] primer:active:bg-[var(--button-default-bgColor-active)] primer:aria-expanded:hover:border-[var(--button-default-borderColor-hover)] primer:aria-expanded:hover:bg-[var(--button-default-bgColor-hover)] primer:aria-expanded:active:border-[var(--button-default-borderColor-active)] primer:aria-expanded:active:bg-[var(--button-default-bgColor-active)]',
    },
    {
      variant: 'primary',
      inactive: false,
      className:
        'primer:aria-expanded:bg-[var(--button-primary-bgColor-active)] primer:aria-expanded:shadow-[var(--button-primary-shadow-selected)] primer:hover:border-[var(--button-primary-borderColor-hover)] primer:hover:bg-[var(--button-primary-bgColor-hover)] primer:active:bg-[var(--button-primary-bgColor-active)] primer:active:shadow-[var(--button-primary-shadow-selected)] primer:aria-expanded:hover:border-[var(--button-primary-borderColor-hover)] primer:aria-expanded:hover:bg-[var(--button-primary-bgColor-hover)] primer:aria-expanded:active:bg-[var(--button-primary-bgColor-active)] primer:aria-expanded:active:shadow-[var(--button-primary-shadow-selected)]',
    },
    {
      variant: 'danger',
      inactive: false,
      className:
        'primer:aria-expanded:[--button-visual-fgColor:var(--button-danger-iconColor-hover)] primer:aria-expanded:border-[var(--button-danger-borderColor-active)] primer:aria-expanded:bg-[var(--button-danger-bgColor-active)] primer:aria-expanded:text-[var(--button-danger-fgColor-active)] primer:aria-expanded:shadow-[var(--button-danger-shadow-selected)] primer:hover:[--button-visual-fgColor:var(--button-danger-iconColor-hover)] primer:hover:border-[var(--button-danger-borderColor-hover)] primer:hover:bg-[var(--button-danger-bgColor-hover)] primer:hover:text-[var(--button-danger-fgColor-hover)] primer:hover:shadow-[var(--shadow-resting-small)] primer:active:[--button-visual-fgColor:var(--button-danger-iconColor-hover)] primer:active:border-[var(--button-danger-borderColor-active)] primer:active:bg-[var(--button-danger-bgColor-active)] primer:active:text-[var(--button-danger-fgColor-active)] primer:active:shadow-[var(--button-danger-shadow-selected)] primer:aria-expanded:hover:border-[var(--button-danger-borderColor-hover)] primer:aria-expanded:hover:bg-[var(--button-danger-bgColor-hover)] primer:aria-expanded:hover:text-[var(--button-danger-fgColor-hover)] primer:aria-expanded:hover:shadow-[var(--shadow-resting-small)] primer:aria-expanded:active:border-[var(--button-danger-borderColor-active)] primer:aria-expanded:active:bg-[var(--button-danger-bgColor-active)] primer:aria-expanded:active:text-[var(--button-danger-fgColor-active)] primer:aria-expanded:active:shadow-[var(--button-danger-shadow-selected)]',
    },
    {
      variant: 'invisible',
      inactive: false,
      className:
        'primer:aria-expanded:bg-[var(--button-invisible-bgColor-active)] primer:hover:[--button-visual-fgColor:var(--button-invisible-iconColor-hover)] primer:hover:border-[var(--button-invisible-borderColor-hover)] primer:hover:bg-[var(--button-invisible-bgColor-hover)] primer:active:[--button-visual-fgColor:var(--button-invisible-iconColor-hover)] primer:active:bg-[var(--button-invisible-bgColor-active)] primer:aria-expanded:hover:bg-[var(--button-invisible-bgColor-hover)] primer:aria-expanded:active:bg-[var(--button-invisible-bgColor-active)]',
    },
    {
      variant: 'link',
      className:
        'primer:inline-flex primer:h-auto primer:min-w-fit primer:rounded-none primer:border-0 primer:p-0 primer:[font-size:inherit]',
    },
    {variant: 'link', inactive: true, className: 'primer:bg-transparent'},
  ],
  defaultVariants: {variant: 'default', size: 'medium', block: false, inactive: false},
})
