'use client'

import {Button as BaseButton} from '@base-ui/react/button'
import React from 'react'
import {cn} from '../../internal/cn'
import type {ControlSize} from '../../utils/types'
import {getButtonClassName} from './ButtonClassName'
import {type ButtonVisual} from './ButtonVisual'
import {ButtonContent} from './ButtonPresentation'
import {getNotificationIndicatorClassName, type NotificationIndicatorPlacement} from './notificationIndicator'
import {buttonBaseClassName} from './styles'
import {useButtonLoading} from './useButtonLoading'

export interface ButtonBaseProps extends React.ComponentPropsWithoutRef<typeof BaseButton> {
  /** Overrides the marker used to identify this element in tests and styling. */
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
  /** Whether the label sits centred or hugs the start edge when visuals are present. */
  alignContent?: 'start' | 'center'
  /** Stretches the button to fill the width of its container. */
  block?: boolean
  /** Overrides the marker used to identify this element in tests and styling. */
  'data-component'?: string
  children?: React.ReactNode
  className?: string
  /** Number shown in a trailing counter, for a button that acts on a known quantity. */
  count?: number | string
  /** Prevents activation and removes the button from the keyboard order. */
  disabled?: boolean
  /** Marks the button temporarily unavailable while keeping it focusable, so its reason can be announced. */
  inactive?: boolean
  /** Lets a long label wrap onto more than one line instead of being clipped. */
  labelWrap?: boolean
  /** Icon shown before the label. */
  leadingVisual?: ButtonVisual
  /** Icon shown at the far end, conventionally a chevron for a button that opens something. */
  trailingAction?: ButtonVisual
  /** Icon shown after the label. */
  trailingVisual?: ButtonVisual
  /** Replaces the leading visual with a spinner and suppresses activation. */
  loading?: boolean
  /** Text announced to assistive technology while the button is loading. */
  loadingAnnouncement?: string
  /**
   * Shows a dot for new activity on the button boundary or on the leading visual. `leadingVisual` requires a
   * `leadingVisual`. The dot is not announced, so describe the activity in the accessible name or description.
   */
  notificationIndicator?: Exclude<NotificationIndicatorPlacement, 'icon'>
  /**
   * Height and text size of the button.
   * @default 'medium'
   */
  size?: ControlSize
  /**
   * Visual weight of the button. Use `primary` for the main action and `danger` for a destructive one.
   * @default 'default'
   */
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
    notificationIndicator,
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
  const {ariaProps, labelId, loadingAnnouncementId} = useButtonLoading(loadingState, rest)

  if (process.env.NODE_ENV !== 'production' && notificationIndicator === 'leadingVisual' && !leadingVisual) {
    // eslint-disable-next-line no-console
    console.warn('Button: `notificationIndicator="leadingVisual"` requires a `leadingVisual` prop.')
  }

  return (
    <ButtonBase
      data-no-visuals={!leadingVisual && !trailingVisual && !trailingAction ? true : undefined}
      data-notification-indicator={notificationIndicator}
      {...rest}
      ref={ref}
      nativeButton={nativeButton}
      type={nativeButton ? (type ?? 'button') : type}
      disabled={disabled}
      {...ariaProps}
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
        className: cn(notificationIndicator === 'button' && getNotificationIndicatorClassName('button'), className),
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
        notificationIndicator={notificationIndicator === 'leadingVisual'}
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
