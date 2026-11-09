'use client'

import {useRender} from '@base-ui/react/use-render'
import React from 'react'
import {cn} from '../../internal/cn'
import {mergeRenderDescription} from '../../internal/renderDescription'
import type {ControlSize} from '../../utils/types'
import {getButtonClassName} from '../Button/ButtonClassName'
import type {ButtonVisual} from '../Button/ButtonVisual'
import {ButtonContent} from '../Button/ButtonPresentation'
import {buttonBaseClassName} from '../Button/styles'
import {useButtonLoading} from '../Button/useButtonLoading'

type LinkButtonState = {
  disabled: boolean
  loading: boolean
}

export interface LinkButtonProps extends Omit<React.ComponentPropsWithoutRef<'a'>, 'children' | 'color' | 'onClick'> {
  /**
   * Whether the label sits centred or hugs the start edge when visuals are present.
   * @default 'center'
   */
  alignContent?: 'start' | 'center'
  /** Stretches the link to fill the width of its container. */
  block?: boolean
  children?: React.ReactNode
  /** Number shown in a trailing counter. */
  count?: number | string
  /** Overrides the marker used to identify this element in tests and styling. */
  'data-component'?: string
  /**
   * Removes the link from the keyboard order and suppresses ordinary click activation. Its `href` remains available
   * to browser actions such as opening the link from a context menu.
   * @default false
   */
  disabled?: boolean
  /** Marks the link temporarily unavailable while keeping it focusable. */
  inactive?: boolean
  /** Lets a long label wrap onto more than one line. Defaults to wrapping within `Dialog.Footer`. */
  labelWrap?: boolean
  /** Icon shown before the label. */
  leadingVisual?: ButtonVisual
  /**
   * Replaces the leading visual with a spinner and suppresses ordinary click activation. Its `href` remains available
   * to browser actions such as opening the link from a context menu.
   * @default false
   */
  loading?: boolean
  /**
   * Loading status text. Set to an empty string when an external announcer communicates loading.
   * @default 'Loading'
   */
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
  /**
   * Visual weight of the link. Use `primary` for the main action and `danger` for a destructive one.
   * @default 'default'
   */
  variant?: 'default' | 'primary' | 'danger' | 'invisible' | 'link'
}

interface LinkButtonBaseProps extends Omit<LinkButtonProps, 'data-component'> {
  autoWrapInActions?: boolean
  'data-component': string
}

export const LinkButtonBase = React.forwardRef<HTMLElement, LinkButtonBaseProps>(function LinkButtonBase(
  {
    alignContent = 'center',
    autoWrapInActions = false,
    block,
    children,
    className,
    count,
    'data-component': dataComponent,
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
  const {ariaProps, labelId, loadingAnnouncementId} = useButtonLoading(loading, loadingAnnouncement, rest)

  return useRender<LinkButtonState, HTMLElement>({
    defaultTagName: 'a',
    render: mergeRenderDescription(render, ariaProps['aria-describedby'], loadingAnnouncementId),
    ref,
    state: {disabled, loading},
    props: {
      ...rest,
      ...ariaProps,
      'aria-disabled': disabled || ariaProps['aria-disabled'],
      className: cn(
        buttonBaseClassName,
        getButtonClassName({
          autoWrapInActions,
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
        href === undefined && render === undefined && 'primer:flex primer:w-full',
      ),
      'data-block': block || undefined,
      'data-component': dataComponent,
      'data-inactive': inactive || undefined,
      'data-label-wrap': labelWrap || undefined,
      'data-loading': loading,
      'data-no-visuals': !leadingVisual && !trailingVisual && !trailingAction ? true : undefined,
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
          autoWrapInActions={autoWrapInActions}
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

export const LinkButton = React.forwardRef<HTMLElement, LinkButtonProps>(function LinkButton(
  {'data-component': dataComponent = 'LinkButton', ...props},
  ref,
) {
  return <LinkButtonBase {...props} ref={ref} autoWrapInActions data-component={dataComponent} />
})

LinkButton.displayName = 'LinkButton'
