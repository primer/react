import {XIcon} from '@primer/octicons-react'
import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import type {TokenSize} from '../../utils/types'

export type {TokenSize} from '../../utils/types'

const tokenBase = cva(
  'relative inline-flex max-w-full items-center whitespace-nowrap rounded-full [font-family:inherit] font-semibold no-underline',
  {
    variants: {
      size: {
        small: 'h-4 px-1 text-xs leading-none',
        medium: 'h-5 px-1.5 text-xs leading-none',
        large: 'h-6 px-2 text-sm leading-none',
        xlarge: 'h-8 px-3 text-sm leading-none',
      },
      interactive: {true: 'cursor-pointer', false: 'cursor-auto'},
      hasRemoveButton: {true: 'pr-0', false: ''},
    },
    defaultVariants: {size: 'medium', interactive: false, hasRemoveButton: false},
  },
)

export interface TokenBaseProps extends Omit<React.HTMLAttributes<HTMLElement>, 'id'> {
  as?: 'span' | 'a' | 'button'
  id?: string | number
  text: React.ReactNode
  size?: TokenSize
  onRemove?: () => void
  hideRemoveButton?: boolean
  isSelected?: boolean
  href?: string
  disabled?: boolean
}

interface TokenTextContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'span' | 'a' | 'button'
  disabled?: boolean
  href?: string
}

export function TokenTextContainer({
  as: Component = 'span',
  children,
  className,
  disabled,
  href,
  ...rest
}: TokenTextContainerProps) {
  const interactive = Component !== 'span' || Boolean(rest.onClick || rest.tabIndex !== undefined)

  return React.createElement(
    Component,
    {
      ...rest,
      className: cn(
        'min-w-0 grow truncate border-0 bg-transparent p-0 [font-family:inherit] [font-size:inherit] [font-weight:inherit] leading-[var(--base-text-lineHeight-normal)] text-inherit no-underline appearance-none',
        interactive && 'cursor-pointer after:absolute after:inset-0 after:content-[""]',
        className,
      ),
      disabled: Component === 'button' ? disabled : undefined,
      href: Component === 'a' && !disabled ? href : undefined,
      type: Component === 'button' ? 'button' : undefined,
    },
    children,
  )
}

export const TokenBase = React.forwardRef<HTMLElement, TokenBaseProps>(function TokenBase(
  {
    as: Component = 'span',
    children,
    className,
    disabled,
    hideRemoveButton = false,
    href,
    id,
    isSelected,
    onClick,
    onKeyDown,
    onRemove,
    size = 'medium',
    text: _text,
    ...rest
  },
  ref,
) {
  const interactive = Component !== 'span' || Boolean(onClick || rest.onFocus || rest.tabIndex)
  const remove = (event: React.KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || disabled) return

    if (Component === 'span' && interactive && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      onClick?.(event as unknown as React.MouseEvent<HTMLElement>)
      return
    }

    if (onRemove && (event.key === 'Backspace' || event.key === 'Delete')) onRemove()
  }
  const click = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    onClick?.(event)
  }
  return (
    <Component
      {...rest}
      ref={ref as React.Ref<never>}
      aria-disabled={Component !== 'button' ? disabled || undefined : undefined}
      className={cn(tokenBase({size, interactive, hasRemoveButton: Boolean(onRemove && !hideRemoveButton)}), className)}
      data-component="TokenBase"
      data-cursor-is-interactive={interactive}
      data-is-selected={isSelected || undefined}
      data-size={size}
      disabled={Component === 'button' ? disabled : undefined}
      href={Component === 'a' && !disabled ? href : undefined}
      id={id?.toString()}
      onClick={click}
      onKeyDown={remove}
      role={Component === 'span' && interactive ? 'button' : undefined}
      tabIndex={Component === 'span' && interactive ? (disabled ? -1 : (rest.tabIndex ?? 0)) : rest.tabIndex}
    >
      {children}
    </Component>
  )
})

export function TokenRemoveButton({
  isParentInteractive = false,
  onRemove,
  size = 'medium',
  text,
}: {
  isParentInteractive?: boolean
  onRemove: () => void
  size?: TokenSize
  text: React.ReactNode
}) {
  const sizeClassName = {
    small: 'ml-1 size-4',
    medium: 'ml-1 size-5',
    large: 'ml-1.5 size-6',
    xlarge: 'ml-1.5 size-8',
  }[size]
  const iconSize = size === 'small' || size === 'medium' ? 12 : 16

  if (isParentInteractive) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          'relative z-1 inline-flex self-baseline items-center justify-center rounded-full text-inherit [transform:translate(1px,-1px)]',
          sizeClassName,
        )}
        data-component="Token.RemoveButton"
        onClick={event => {
          event.stopPropagation()
          onRemove()
        }}
        tabIndex={-1}
      >
        <XIcon size={iconSize} />
      </span>
    )
  }

  return (
    <button
      aria-label={`Remove ${typeof text === 'string' ? text : 'token'}`}
      className={cn(
        'inline-flex self-baseline items-center justify-center rounded-full border-0 bg-transparent p-0 [font-family:inherit] text-inherit [transform:translate(1px,-1px)] transition-colors hover:bg-[var(--control-transparent-bgColor-hover)] focus-visible:bg-[var(--control-transparent-bgColor-hover)] focus-visible:outline-2 focus-visible:outline-focus active:bg-[var(--control-transparent-bgColor-active)]',
        sizeClassName,
      )}
      data-component="Token.RemoveButton"
      onClick={event => {
        event.stopPropagation()
        onRemove()
      }}
      type="button"
    >
      <XIcon size={iconSize} />
    </button>
  )
}
