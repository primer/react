import {XIcon} from '@primer/octicons-react'
import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

export type TokenSize = 'small' | 'medium' | 'large' | 'xlarge'

const tokenBase = cva(
  'relative inline-flex max-w-full items-center rounded-full font-semibold leading-none no-underline',
  {
    variants: {
      size: {
        small: 'h-4 px-1 text-sm',
        medium: 'h-5 px-1.5 text-sm',
        large: 'h-6 px-2 text-base',
        xlarge: 'h-8 px-3 text-base',
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

export function TokenRemoveButton({onRemove, text}: {onRemove: () => void; text: React.ReactNode}) {
  return (
    <button
      aria-label={`Remove ${typeof text === 'string' ? text : 'token'}`}
      className="ml-1 grid size-5 place-items-center rounded-full text-muted hover:bg-neutral-muted focus-visible:outline-2 focus-visible:outline-accent-emphasis"
      data-component="Token.RemoveButton"
      onClick={event => {
        event.stopPropagation()
        onRemove()
      }}
      type="button"
    >
      <XIcon size={12} />
    </button>
  )
}
