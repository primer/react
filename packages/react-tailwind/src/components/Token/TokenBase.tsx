import {XIcon} from '@primer/octicons-react'
import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import {UnstyledButton} from '../../internal/UnstyledButton'
import type {CompatibleRootRef, SpanTokenActionExclusions, TokenElement, TokenRoot} from '../../internal/token-props'
import type {TokenSize} from '../../utils/types'
import type {PolymorphicProps} from '../../utils/types/component'

export type {TokenSize} from '../../utils/types'

const tokenBase = cva(
  'primer:relative primer:inline-flex primer:max-w-full primer:items-center primer:whitespace-nowrap primer:rounded-full primer:[font-family:inherit] primer:font-semibold primer:no-underline',
  {
    variants: {
      size: {
        small: 'primer:h-4 primer:px-1 primer:text-xs primer:leading-none',
        medium: 'primer:h-5 primer:px-1.5 primer:text-xs primer:leading-none',
        large: 'primer:h-6 primer:px-2 primer:text-sm primer:leading-none',
        xlarge: 'primer:h-8 primer:px-3 primer:text-sm primer:leading-none',
      },
      interactive: {true: 'primer:cursor-pointer', false: 'primer:cursor-auto'},
      hasRemoveButton: {true: 'primer:pr-0', false: ''},
    },
    defaultVariants: {size: 'medium', interactive: false, hasRemoveButton: false},
  },
)

export interface TokenOwnProps extends Omit<React.HTMLAttributes<HTMLElement>, 'id'> {
  /**
   * Element to render. Use `a` or `button` when the token is interactive.
   * @default 'span'
   */
  as?: TokenElement
  /** Identifier applied to the root element. */
  id?: string | number
  /** Label shown on the token. */
  text: React.ReactNode
  /** Height and text size of the token. */
  size?: TokenSize
  /** Shows a remove button and is called when it is activated. */
  onRemove?: () => void
  /**
   * Hides the remove button while `onRemove` still handles removal by keyboard.
   * @default false
   */
  hideRemoveButton?: boolean
  /** Marks the token as the current one in a list of tokens. */
  isSelected?: boolean
  /** Prevents interaction with the token and its remove button. */
  disabled?: boolean
}

export interface CompoundTokenOwnProps extends TokenOwnProps {
  /** Full accessible name for the separate remove button, including the visible text and item context. */
  removeButtonLabel?: string
}

export type TokenBaseProps<As extends TokenElement = 'span'> = PolymorphicProps<As, TokenOwnProps, 'span'>

type BroadTokenBaseProps<Inferred extends TokenBaseProps<TokenElement>> = Inferred &
  ('as' extends keyof Inferred
    ? 'span' | 'a' | 'button' extends NonNullable<Inferred['as']>
      ? unknown
      : never
    : never) &
  ([Inferred['ref']] extends [CompatibleRootRef<HTMLElement, Inferred['ref']>] ? unknown : never)

interface TokenBaseComponent {
  <Ref extends React.Ref<HTMLSpanElement> = React.Ref<HTMLSpanElement>>(
    props: Omit<TokenBaseProps<'span'>, 'ref'> & {
      ref?: Ref & CompatibleRootRef<HTMLSpanElement, Ref>
    } & SpanTokenActionExclusions<TokenOwnProps>,
  ): React.ReactElement
  <As extends TokenElement, Ref extends React.Ref<TokenRoot<As>> = React.Ref<TokenRoot<As>>>(
    props: TokenOwnProps &
      Omit<TokenBaseProps<As>, 'as' | 'ref'> & {
        as: As | undefined
        ref?: Ref & CompatibleRootRef<TokenRoot<As>, Ref>
      } & SpanTokenActionExclusions<TokenOwnProps> &
      (TokenElement extends As ? never : unknown),
  ): React.ReactElement
  <As extends TokenElement, Ref extends React.Ref<React.ComponentRef<As>> = React.Ref<React.ComponentRef<As>>>(
    props: TokenOwnProps &
      Omit<TokenBaseProps<As>, 'as' | 'ref'> & {
        as: As
        ref?: Ref & CompatibleRootRef<React.ComponentRef<As>, Ref>
      } & (TokenElement extends As ? never : unknown),
  ): React.ReactElement
  <Inferred extends TokenBaseProps<TokenElement>>(props: BroadTokenBaseProps<Inferred>): React.ReactElement
}

interface TokenTextContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  disabled?: boolean
  href?: string
  type?: string
}

export function TokenTextContainer({
  as: Component = 'span',
  children,
  className,
  disabled,
  href,
  type,
  ...rest
}: TokenTextContainerProps) {
  const interactive = Component !== 'span' || Boolean(rest.onClick || rest.tabIndex !== undefined)

  return React.createElement(
    Component,
    {
      ...rest,
      className: cn(
        'primer:min-w-0 primer:grow primer:truncate primer:border-0 primer:bg-transparent primer:p-0 primer:[font-family:inherit] primer:[font-size:inherit] primer:[font-weight:inherit] primer:leading-[var(--base-text-lineHeight-normal)] primer:text-inherit primer:no-underline primer:appearance-none',
        interactive && "primer:cursor-pointer primer:after:absolute primer:after:inset-0 primer:after:content-['']",
        className,
      ),
      disabled: Component === 'button' || typeof Component !== 'string' ? disabled : undefined,
      href: (Component === 'a' || typeof Component !== 'string') && !disabled ? href : undefined,
      type: Component === 'button' ? (type ?? 'button') : Component !== 'span' ? type : undefined,
    },
    children,
  )
}

export function TokenBaseInternal<As extends TokenElement = 'span'>({
  as,
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
  type,
  ...rest
}: TokenBaseProps<As>) {
  const Component: React.ElementType = as ?? 'span'
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
      aria-disabled={Component !== 'button' && disabled ? true : rest['aria-disabled']}
      className={cn(tokenBase({size, interactive, hasRemoveButton: Boolean(onRemove && !hideRemoveButton)}), className)}
      data-component="TokenBase"
      data-cursor-is-interactive={interactive}
      data-is-selected={isSelected || undefined}
      data-size={size}
      disabled={Component === 'button' || typeof Component !== 'string' ? disabled : undefined}
      href={(Component === 'a' || typeof Component !== 'string') && !disabled ? href : undefined}
      id={id?.toString()}
      onClick={click}
      onKeyDown={remove}
      role={Component === 'span' && interactive ? 'button' : undefined}
      tabIndex={Component === 'span' && interactive ? (disabled ? -1 : (rest.tabIndex ?? 0)) : rest.tabIndex}
      type={Component === 'button' ? (type ?? 'button') : Component !== 'span' ? type : undefined}
    >
      {children}
    </Component>
  )
}

TokenBaseInternal.displayName = 'TokenBase'

export const TokenBase: TokenBaseComponent = TokenBaseInternal

export function TokenRemoveButton({
  isParentInteractive = false,
  label,
  onRemove,
  size = 'medium',
  text,
}: {
  isParentInteractive?: boolean
  label?: string
  onRemove: () => void
  size?: TokenSize
  text: React.ReactNode
}) {
  const sizeClassName = {
    small: 'primer:ml-1 primer:size-4',
    medium: 'primer:ml-1 primer:size-5',
    large: 'primer:ml-1.5 primer:size-6',
    xlarge: 'primer:ml-1.5 primer:size-8',
  }[size]
  const iconSize = size === 'small' || size === 'medium' ? 12 : 16

  if (isParentInteractive) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          'primer:relative primer:z-1 primer:inline-flex primer:self-baseline primer:items-center primer:justify-center primer:rounded-full primer:text-inherit primer:[transform:translate(1px,-1px)]',
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
    <UnstyledButton
      aria-label={label ?? `Remove ${typeof text === 'string' ? text : 'token'}`}
      className={cn(
        'primer:self-baseline primer:justify-center primer:rounded-full primer:[transform:translate(1px,-1px)] primer:transition-colors primer:hover:bg-[var(--control-transparent-bgColor-hover)] primer:focus-visible:bg-[var(--control-transparent-bgColor-hover)] primer:active:bg-[var(--control-transparent-bgColor-active)]',
        sizeClassName,
      )}
      data-component="Token.RemoveButton"
      onClick={event => {
        event.stopPropagation()
        onRemove()
      }}
    >
      <XIcon size={iconSize} />
    </UnstyledButton>
  )
}
