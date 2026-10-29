import React, {useRef} from 'react'
import {clsx} from 'clsx'
import {AriaStatus} from '../live-region'
import VisuallyHidden from '../_VisuallyHidden'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import classes from './TableBulkActions.module.css'

export type TableBulkActionsProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'role'> & {
  selectedCount: number
  onFocusReturn?: () => void
  getSelectedCountLabel?: (selectedCount: number) => string
}

function defaultSelectedCountLabel(selectedCount: number) {
  return `${selectedCount} selected`
}

const TableBulkActions = React.forwardRef<HTMLDivElement, TableBulkActionsProps>(function TableBulkActions(
  {
    selectedCount,
    onFocusReturn,
    getSelectedCountLabel = defaultSelectedCountLabel,
    'aria-label': ariaLabel = 'Bulk actions',
    className,
    children,
    onFocusCapture,
    onBlurCapture,
    ...rest
  },
  ref,
) {
  const focusedAction = useRef<HTMLElement | null>(null)
  const focusObserver = useRef<MutationObserver | null>(null)
  const active = selectedCount > 0

  function recoverFocus() {
    const element = focusedAction.current
    if (element && !element.isConnected) {
      focusedAction.current = null
      focusObserver.current?.disconnect()
      const document = element.ownerDocument
      if (document.activeElement === document.body) {
        onFocusReturn?.()
      }
    }
  }

  function observeFocusedAction() {
    focusObserver.current?.disconnect()
    const element = focusedAction.current
    if (element) {
      const observer = new MutationObserver(recoverFocus)
      observer.observe(element.ownerDocument.body, {childList: true, subtree: true})
      focusObserver.current = observer
    }
  }

  useLayoutEffect(() => {
    recoverFocus()
    observeFocusedAction()
    return () => {
      focusObserver.current?.disconnect()
    }
  })

  const count = (
    <AriaStatus as="span" className={classes.Count} announceOnShow={active}>
      {getSelectedCountLabel(selectedCount)}
    </AriaStatus>
  )

  return (
    <div
      {...rest}
      onFocusCapture={event => {
        focusedAction.current = event.target
        observeFocusedAction()
        if (event.currentTarget.contains(event.target)) {
          event.target.scrollIntoView({block: 'nearest', inline: 'nearest'})
        }
        if (!event.defaultPrevented) {
          onFocusCapture?.(event)
        }
      }}
      onBlurCapture={event => {
        if (event.target.isConnected) {
          focusedAction.current = null
          focusObserver.current?.disconnect()
        }
        if (!event.defaultPrevented) {
          onBlurCapture?.(event)
        }
      }}
      ref={ref}
      role={active ? 'group' : undefined}
      aria-label={active ? ariaLabel : undefined}
      data-component="Table.BulkActions"
      data-active={active || undefined}
      className={clsx(classes.TableBulkActions, className)}
    >
      <VisuallyHidden isVisible={active}>{count}</VisuallyHidden>
      {active ? <div className={classes.Actions}>{children}</div> : null}
    </div>
  )
})

export {TableBulkActions}
