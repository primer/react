import {Button as BaseButton} from '@base-ui/react/button'
import {type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import {Spinner} from '../Spinner'
import {buttonBaseClassName, buttonVariants} from './styles'

export interface ButtonBaseProps extends React.ComponentPropsWithoutRef<typeof BaseButton> {
  'data-component'?: string
}

type ButtonBaseState = Parameters<Exclude<ButtonBaseProps['className'], string | undefined>>[0]

export const ButtonBase = React.forwardRef<HTMLElement, ButtonBaseProps>(function ButtonBase(
  {className, 'data-component': dataComponent = 'ButtonBase', ...rest},
  ref,
) {
  const mergedClassName =
    typeof className === 'function'
      ? (state: ButtonBaseState) => cn(buttonBaseClassName, className(state))
      : cn(buttonBaseClassName, className)

  return <BaseButton {...rest} ref={ref} className={mergedClassName} data-component={dataComponent} />
})

export interface ButtonProps
  extends Omit<ButtonBaseProps, 'className' | 'children' | 'data-component' | 'disabled'>,
    VariantProps<typeof buttonVariants> {
  'data-component'?: string
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  leadingVisual?: React.ReactNode
  trailingVisual?: React.ReactNode
  loading?: boolean
  loadingAnnouncement?: string
}

export const Button = React.forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    block,
    children,
    className,
    'data-component': dataComponent = 'Button',
    disabled,
    leadingVisual,
    loading = false,
    loadingAnnouncement = 'Loading',
    size,
    trailingVisual,
    type = 'button',
    variant,
    ...rest
  },
  ref,
) {
  return (
    <ButtonBase
      {...rest}
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-component={dataComponent}
      data-loading={loading || undefined}
      className={cn(buttonVariants({block, size, variant}), className)}
    >
      {loading ? <Spinner aria-hidden="true" size="small" srText={null} /> : leadingVisual}
      {children}
      {!loading && trailingVisual}
      {loading && <span className="sr-only">{loadingAnnouncement}</span>}
    </ButtonBase>
  )
})

Button.displayName = 'Button'
