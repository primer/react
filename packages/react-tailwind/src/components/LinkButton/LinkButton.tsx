'use client'

import {useRender} from '@base-ui/react/use-render'
import React from 'react'
import {cn} from '../../internal/cn'
import type {ControlSize} from '../../utils/types'
import {getButtonClassName} from '../Button/ButtonClassName'
import type {ButtonVisual} from '../Button/ButtonVisual'
import {ButtonContent} from '../Button/ButtonPresentation'
import {buttonBaseClassName} from '../Button/styles'

type LinkButtonState = {
  disabled: boolean
  loading: boolean
}

export interface LinkButtonProps extends Omit<React.ComponentPropsWithoutRef<'a'>, 'children' | 'color' | 'onClick'> {
  /** Whether the label sits centred or hugs the start edge when visuals are present. */
  alignContent?: 'start' | 'center'
  /** Stretches the link to fill the width of its container. */
  block?: boolean
  children?: React.ReactNode
  /** Number shown in a trailing counter. */
  count?: number | string
  /** Prevents navigation and removes the link from the keyboard order. */
  disabled?: boolean
  /** Marks the link temporarily unavailable while keeping it focusable. */
  inactive?: boolean
  /** Lets a long label wrap onto more than one line instead of being clipped. */
  labelWrap?: boolean
  /** Icon shown before the label. */
  leadingVisual?: ButtonVisual
  /** Replaces the leading visual with a spinner and suppresses navigation. */
  loading?: boolean
  /** Text announced to assistive technology while the link is loading. */
  loadingAnnouncement?: string
  /** Called when the link is activated. */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  /** Renders the link as your own element, for a router link that still needs button styling. */
  render?: useRender.RenderProp<LinkButtonState>
  /**
   * Height and text size of the link.
   * @default 'medium'
   */
  size?: ControlSize
  /** Icon shown at the far end, conventionally a chevron. */
  trailingAction?: ButtonVisual
  /** Icon shown after the label. */
  trailingVisual?: ButtonVisual
  /** Visual weight of the link. Use `primary` for the main action and `danger` for a destructive one. */
  variant?: 'default' | 'primary' | 'danger' | 'invisible' | 'link'
}

export const LinkButton = React.forwardRef<HTMLElement, LinkButtonProps>(function LinkButton(
  {
    alignContent = 'center',
    block,
    children,
    className,
    count,
    disabled = false,
    href,
    inactive,
    labelWrap,
    leadingVisual,
    loading = false,
    loadingAnnouncement = 'Loading',
    onClick,
    render,
    size,
    tabIndex,
    trailingAction,
    trailingVisual,
    variant = 'default',
    ...rest
  },
  ref,
) {
  const id = React.useId()
  const loadingAnnouncementId = `${id}-loading-announcement`
  const labelId = `${id}-label`

  return useRender<LinkButtonState, HTMLElement>({
    defaultTagName: 'a',
    render,
    ref,
    state: {disabled, loading},
    props: {
      ...rest,
      'aria-busy': loading || undefined,
      'aria-describedby': loading ? loadingAnnouncementId : rest['aria-describedby'],
      'aria-disabled': disabled || loading || rest['aria-disabled'],
      'aria-labelledby': loading
        ? (rest['aria-labelledby'] ?? (rest['aria-label'] ? undefined : labelId))
        : rest['aria-labelledby'],
      className: cn(
        buttonBaseClassName,
        getButtonClassName({
          block,
          children,
          className,
          count,
          inactive,
          labelWrap,
          leadingVisual,
          size,
          variant,
        }),
        href === undefined && render === undefined && 'flex w-full',
      ),
      'data-block': block || undefined,
      'data-component': 'LinkButton',
      'data-inactive': inactive || undefined,
      'data-label-wrap': labelWrap || undefined,
      'data-loading': loading,
      'data-size': size ?? 'medium',
      'data-variant': variant,
      href,
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (disabled || loading) {
          event.preventDefault()
          event.stopPropagation()
          return
        }
        onClick?.(event)
      },
      tabIndex: disabled ? -1 : tabIndex,
      children: (
        <ButtonContent
          alignContent={alignContent}
          count={count}
          labelId={labelId}
          labelWrap={labelWrap}
          leadingVisual={leadingVisual}
          loading={loading}
          loadingAnnouncement={loadingAnnouncement}
          loadingAnnouncementId={loadingAnnouncementId}
          size={size}
          trailingAction={trailingAction}
          trailingVisual={trailingVisual}
          variant={variant}
        >
          {children}
        </ButtonContent>
      ),
    },
  })
})

LinkButton.displayName = 'LinkButton'
