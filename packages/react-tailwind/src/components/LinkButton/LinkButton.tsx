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
  alignContent?: 'start' | 'center'
  block?: boolean
  children?: React.ReactNode
  count?: number | string
  disabled?: boolean
  inactive?: boolean
  labelWrap?: boolean
  leadingVisual?: ButtonVisual
  loading?: boolean
  loadingAnnouncement?: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  render?: useRender.RenderProp<LinkButtonState>
  size?: ControlSize
  trailingAction?: ButtonVisual
  trailingVisual?: ButtonVisual
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
;('use client')
