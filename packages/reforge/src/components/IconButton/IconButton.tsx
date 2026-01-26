import React from 'react'
import {Button as BaseButton} from '@base-ui/react/button'
import type {Icon} from '@primer/octicons-react'
import {cva, type VariantProps} from 'cva'

import {buttonBaseStyles, buttonInactiveStyles, buttonVariantStyles} from '../Button'
import {Tooltip} from '../Tooltip'

const iconButtonVariants = cva({
  base: [buttonBaseStyles, 'flex items-center justify-center shrink-0'],
  variants: {
    variant: {
      default: [...buttonVariantStyles.default, 'text-muted hover:text-muted'],
      primary: buttonVariantStyles.primary,
      danger: buttonVariantStyles.danger,
      invisible: [...buttonVariantStyles.invisible, 'text-muted hover:text-muted'],
    },
    size: {
      small: ['size-7', '[&_svg]:size-4'],
      medium: ['size-8', '[&_svg]:size-4'],
      large: ['size-10', '[&_svg]:size-5'],
    },
    inactive: buttonInactiveStyles,
    loading: {
      true: 'cursor-wait',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'medium',
    inactive: false,
    loading: false,
  },
})

type IconButtonVariants = VariantProps<typeof iconButtonVariants>

type TooltipProps = Pick<Tooltip.Popup.Props, 'side' | 'align' | 'sideOffset' | 'alignOffset' | 'collisionPadding'>

type IconButtonProps = Omit<BaseButton.Props, 'color' | 'children'> &
  IconButtonVariants &
  TooltipProps & {
    icon: React.ReactElement<Icon>
    'aria-label': string
    description?: string
    loading?: boolean
    inactive?: boolean
    type?: 'button' | 'submit' | 'reset'
  }

function IconButton({
  className,
  variant,
  size,
  icon,
  'aria-label': ariaLabel,
  description,
  side,
  align,
  sideOffset,
  alignOffset,
  collisionPadding,
  loading = false,
  inactive = false,
  disabled,
  type = 'button',
  ...rest
}: IconButtonProps) {
  const isDisabled = disabled || loading

  const button = (
    <BaseButton
      type={type}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={iconButtonVariants({
        variant,
        size,
        inactive,
        loading,
        className: typeof className === 'function' ? undefined : className,
      })}
      data-variant={variant}
      data-size={size}
      data-inactive={inactive || undefined}
      data-loading={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span className="flex items-center justify-center" aria-hidden="true">
          <LoadingSpinner size={size} />
        </span>
      ) : (
        <span className="flex items-center justify-center" aria-hidden="true">
          {icon}
        </span>
      )}
    </BaseButton>
  )

  if (description) {
    return (
      <Tooltip.Root>
        <Tooltip.Trigger render={button} />
        <Tooltip.Popup
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          collisionPadding={collisionPadding}
        >
          {description}
        </Tooltip.Popup>
      </Tooltip.Root>
    )
  }

  return button
}

const spinnerVariants = cva({
  base: ['inline-block animate-spin rounded-full border-current border-b-transparent'],
  variants: {
    size: {
      small: 'size-4 border-2',
      medium: 'size-4 border-2',
      large: 'size-5 border-2',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
})

function LoadingSpinner({size = 'medium'}: {size?: IconButtonVariants['size']}) {
  return <span className={spinnerVariants({size})} aria-hidden="true" />
}

export {IconButton, iconButtonVariants}

export namespace IconButton {
  export type Props = IconButtonProps
  export type Variant = IconButtonVariants['variant']
  export type Size = IconButtonVariants['size']
}
