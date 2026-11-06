'use client'

import React from 'react'
import {cn} from '../../internal/cn'
import {AriaStatus} from '../LiveRegion'

export interface TableBulkActionsProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'role'> {
  /** Number of selected rows. The actions show only when it is greater than zero. */
  selectedCount: number
  /** Called when the focused action is removed, so focus can move somewhere meaningful instead of the page. */
  onFocusReturn?: () => void
  /**
   * Formats the announced selection count.
   * @default selectedCount => `${selectedCount} selected`
   */
  getSelectedCountLabel?: (selectedCount: number) => string
  /** Accessible name for the group of actions. */
  'aria-label'?: string
}

function defaultSelectedCountLabel(selectedCount: number) {
  return `${selectedCount} selected`
}

/** Announces the selection count and groups the actions that apply to the selected rows. */
export const TableBulkActions = React.forwardRef<HTMLDivElement, TableBulkActionsProps>(function TableBulkActions(
  {
    'aria-label': ariaLabel = 'Bulk actions',
    children,
    className,
    getSelectedCountLabel = defaultSelectedCountLabel,
    onBlurCapture,
    onFocusCapture,
    onFocusReturn,
    selectedCount,
    ...props
  },
  ref,
) {
  const focusedAction = React.useRef<HTMLElement | null>(null)
  const focusObserver = React.useRef<MutationObserver | null>(null)
  const active = selectedCount > 0

  function recoverFocus() {
    const element = focusedAction.current
    if (element && !element.isConnected) {
      focusedAction.current = null
      focusObserver.current?.disconnect()
      const document = element.ownerDocument
      if (document.activeElement === document.body) onFocusReturn?.()
    }
  }

  // Actions often remove themselves (for example by clearing the selection), so watch for the focused one leaving.
  function observeFocusedAction() {
    focusObserver.current?.disconnect()
    const element = focusedAction.current
    if (element) {
      const observer = new MutationObserver(recoverFocus)
      observer.observe(element.ownerDocument.body, {childList: true, subtree: true})
      focusObserver.current = observer
    }
  }

  React.useLayoutEffect(() => {
    recoverFocus()
    observeFocusedAction()
    return () => {
      focusObserver.current?.disconnect()
    }
  })

  return (
    <div
      {...props}
      ref={ref}
      aria-label={active ? ariaLabel : undefined}
      data-active={active || undefined}
      data-component="Table.BulkActions"
      role={active ? 'group' : undefined}
      className={cn(
        'data-[active]:flex data-[active]:flex-wrap data-[active]:items-center data-[active]:gap-2',
        className,
      )}
      onBlurCapture={event => {
        if (event.target.isConnected) {
          focusedAction.current = null
          focusObserver.current?.disconnect()
        }
        onBlurCapture?.(event)
      }}
      onFocusCapture={event => {
        focusedAction.current = event.target
        observeFocusedAction()
        // jsdom does not implement scrollIntoView.
        if (event.currentTarget.contains(event.target) && 'scrollIntoView' in event.target) {
          event.target.scrollIntoView({block: 'nearest', inline: 'nearest'})
        }
        onFocusCapture?.(event)
      }}
    >
      <span className={active ? undefined : 'sr-only'}>
        <AriaStatus as="span" announceOnShow={active} className="font-semibold text-muted">
          {getSelectedCountLabel(selectedCount)}
        </AriaStatus>
      </span>
      {active ? (
        <div className="ms-auto flex flex-wrap items-center gap-2 [&_:focus]:scroll-m-1">{children}</div>
      ) : null}
    </div>
  )
})
