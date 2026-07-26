'use client'

import {Button as BaseButton} from '@base-ui/react/button'
import React from 'react'
import {cn} from '../../internal/cn'
import type {ControlSize} from '../../utils/types'
import {getButtonClassName} from './ButtonClassName'
import {type ButtonVisual} from './ButtonVisual'
import {ButtonContent} from './ButtonPresentation'
import {buttonBaseClassName} from './styles'

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

export interface ButtonProps extends Omit<ButtonBaseProps, 'className' | 'children' | 'data-component' | 'disabled'> {
  alignContent?: 'start' | 'center'
  block?: boolean
  'data-component'?: string
  children?: React.ReactNode
  className?: string
  count?: number | string
  disabled?: boolean
  inactive?: boolean
  labelWrap?: boolean
  leadingVisual?: ButtonVisual
  trailingAction?: ButtonVisual
  trailingVisual?: ButtonVisual
  loading?: boolean
  loadingAnnouncement?: string
  size?: ControlSize
  variant?: 'default' | 'primary' | 'danger' | 'invisible' | 'link'
}

export const Button = React.forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    alignContent = 'center',
    block,
    children,
    className,
    count,
    'data-component': dataComponent = 'Button',
    disabled,
    inactive,
    labelWrap,
    leadingVisual,
    loading,
    loadingAnnouncement = 'Loading',
    nativeButton = true,
    size,
    trailingAction,
    trailingVisual,
    type,
    variant = 'default',
    ...rest
  },
  ref,
) {
  const loadingState = Boolean(loading)
  const id = React.useId()
  const loadingAnnouncementId = `${id}-loading-announcement`
  const labelId = `${id}-label`

  return (
    <ButtonBase
      {...rest}
      ref={ref}
      nativeButton={nativeButton}
      type={nativeButton ? (type ?? 'button') : type}
      disabled={disabled}
      aria-busy={loadingState || undefined}
      aria-disabled={loadingState || rest['aria-disabled']}
      aria-describedby={loadingState ? loadingAnnouncementId : rest['aria-describedby']}
      aria-labelledby={
        loadingState ? (rest['aria-labelledby'] ?? (rest['aria-label'] ? undefined : labelId)) : rest['aria-labelledby']
      }
      data-component={dataComponent}
      data-block={block || undefined}
      data-inactive={inactive || undefined}
      data-label-wrap={labelWrap || undefined}
      data-loading={loadingState}
      data-size={size ?? 'medium'}
      data-variant={variant}
      onClick={loadingState ? event => event.preventDefault() : rest.onClick}
      className={getButtonClassName({
        block,
        children,
        className,
        count,
        inactive,
        labelWrap,
        leadingVisual,
        size,
        variant,
      })}
    >
      <ButtonContent
        alignContent={alignContent}
        count={count}
        labelId={labelId}
        labelWrap={labelWrap}
        leadingVisual={leadingVisual}
        loading={loadingState}
        loadingAnnouncement={loadingAnnouncement}
        loadingAnnouncementId={loadingAnnouncementId}
        size={size}
        trailingAction={trailingAction}
        trailingVisual={trailingVisual}
        variant={variant}
      >
        {children}
      </ButtonContent>
    </ButtonBase>
  )
})

Button.displayName = 'Button'
;('use client')
