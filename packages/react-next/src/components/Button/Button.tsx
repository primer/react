import React from 'react'
import {Button as BaseButton} from '@base-ui/react/button'
import type {Icon} from '@primer/octicons-react'
import {cva, cx, type VariantProps} from 'cva'

/**
 * Shared base styles for button-like components (Button, IconButton).
 */
const buttonBaseStyles = cx([
  'relative select-none cursor-pointer',
  'rounded-medium',
  'font-semibold align-middle transition-[background-color,color,border-color,box-shadow] duration-150',
  'disabled:cursor-not-allowed',
  'focus-visible:outline-focus-default focus-visible:outline-2 focus-visible:-outline-offset-1',
  'focus:z-raised',
])

/**
 * Shared variant styles for button-like components.
 * These define the color, background, and border styles for each variant.
 */
const buttonVariantStyles = {
  default: [
    'text-button-default-rest hover:text-button-default-hover active:text-button-default-active disabled:text-button-default-disabled shadow-button-default-rest',
    'bg-button-default-rest hover:bg-button-default-hover active:bg-button-default-active disabled:bg-button-default-disabled ',
    'border border-button-default-rest hover:border-button-default-hover active:border-button-default-active disabled:border-button-default-disabled',
    'aria-expanded:bg-button-default-active',
  ],
  primary: [
    'text-button-primary-rest disabled:text-button-primary-disabled shadow-button-default-rest',
    'bg-button-primary-rest hover:bg-button-primary-hover active:bg-button-primary-active disabled:bg-button-primary-disabled',
    'border border-button-primary-rest hover:border-button-primary-hover active:border-button-primary-active disabled:border-button-primary-disabled',
    'aria-expanded:bg-button-primary-active',
  ],
  danger: [
    'text-button-danger-rest hover:text-button-danger-hover active:text-button-danger-active disabled:text-button-danger-disabled shadow-button-default-rest',
    'bg-button-danger-rest hover:bg-button-danger-hover active:bg-button-danger-active disabled:bg-button-danger-disabled',
    'border border-button-danger-rest hover:border-button-danger-hover active:border-button-danger-active disabled:border-button-danger-disabled',
    'aria-expanded:bg-button-danger-active',
  ],
  invisible: [
    'text-button-invisible-rest hover:text-button-invisible-hover active:text-button-invisible-active disabled:text-button-invisible-disabled',
    'bg-button-invisible-rest hover:bg-button-invisible-hover active:bg-button-invisible-active disabled:bg-button-invisible-disabled',
    'border border-button-invisible-rest hover:border-button-invisible-hover disabled:border-button-invisible-disabled',
    'aria-expanded:bg-button-invisible-active',
  ],
  link: ['text-link hover:underline hover:underline-offset-3 active:text-button-link-active disabled:text-disabled'],
}

/**
 * Shared inactive state styles.
 */
const buttonInactiveStyles = {
  true: 'opacity-60 pointer-events-none',
  false: '',
}

const buttonVariants = cva({
  base: [buttonBaseStyles, 'flex items-stretch', 'min-w-fit'],
  variants: {
    variant: {
      default: [
        ...buttonVariantStyles.default,
        '**:data-[component="leadingVisual"]:text-muted **:data-[component="trailingVisual"]:text-muted',
        'disabled:**:data-[component="leadingVisual"]:text-button-default-disabled disabled:**:data-[component="trailingVisual"]:text-button-default-disabled',
      ],
      primary: buttonVariantStyles.primary,
      danger: buttonVariantStyles.danger,
      invisible: [
        ...buttonVariantStyles.invisible,
        '**:data-[component="leadingVisual"]:text-muted **:data-[component="trailingVisual"]:text-muted',
        'disabled:**:data-[component="leadingVisual"]:text-button-invisible-disabled disabled:**:data-[component="trailingVisual"]:text-button-invisible-disabled',
      ],
      link: buttonVariantStyles.link,
    },
    block: {
      true: 'w-full',
      false: 'w-auto',
    },
    size: {
      small: ['text-body-small', 'h-7 px-2'],
      medium: ['text-body-medium', 'h-8 px-3'],
      large: ['text-body-medium', 'h-10 px-4'],
    },
    inactive: buttonInactiveStyles,
  },
  defaultVariants: {
    variant: 'default',
    block: false,
    size: 'medium',
    inactive: false,
  },
})

const buttonContentClassName = 'grid auto-cols-max grid-flow-col items-center justify-center gap-2 w-full'

type ButtonVariants = VariantProps<typeof buttonVariants>

type ButtonProps = BaseButton.Props &
  Omit<ButtonVariants, 'loading'> & {
    ref?: React.Ref<HTMLButtonElement>
    leadingVisual?: React.ReactElement<Icon>
    trailingVisual?: React.ReactElement<Icon>
    trailingAction?: React.ReactNode
    block?: boolean
    inactive?: boolean
    labelWrap?: boolean
    nativeButton?: true
  }

function Button({
  ref,
  type = 'button',
  className,
  variant,
  size,
  block,
  leadingVisual,
  trailingVisual,
  trailingAction,
  children,
  inactive = false,
  labelWrap: _labelWrap = false,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <BaseButton
      ref={ref}
      type={type}
      disabled={disabled}
      className={buttonVariants({
        variant,
        size,
        block,
        inactive,
        className: typeof className === 'function' ? undefined : className,
      })}
      data-variant={variant}
      data-size={size}
      data-inactive={inactive || undefined}
      data-block={block || undefined}
      {...rest}
    >
      <span data-component="content" className={buttonContentClassName}>
        {leadingVisual && (
          <span
            className="flex items-center justify-center text-current"
            aria-hidden="true"
            data-component="leadingVisual"
          >
            {leadingVisual}
          </span>
        )}
        {children && (
          <span data-component="label" className="flex w-full items-center">
            {children}
          </span>
        )}
        {trailingVisual && (
          <span
            className="flex items-center justify-center text-current"
            aria-hidden="true"
            data-component="trailingVisual"
          >
            {trailingVisual}
          </span>
        )}
        {trailingAction && (
          <span
            className="flex items-center justify-center text-current"
            aria-hidden="true"
            data-component="trailingAction"
          >
            {trailingAction}
          </span>
        )}
      </span>
    </BaseButton>
  )
}

export {Button, buttonVariants, buttonBaseStyles, buttonVariantStyles, buttonInactiveStyles, buttonContentClassName}

export namespace Button {
  export type Props = ButtonProps
  export type Variant = ButtonVariants['variant']
  export type Size = ButtonVariants['size']
}
