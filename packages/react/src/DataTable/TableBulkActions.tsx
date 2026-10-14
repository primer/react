import React, {useRef} from 'react'
import {clsx} from 'clsx'
import {AriaStatus} from '../live-region'
import VisuallyHidden from '../_VisuallyHidden'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import classes from './TableBulkActions.module.css'

export type TableBulkActionsProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'role'> & {
  /**
   * The number of effectively selected rows. Keep this component mounted at zero
   * so the count announcement and focus recovery can complete.
   */
  selectedCount: number
  /**
   * Restores focus when a focused action disappears. Not called if focus has
   * already moved elsewhere, for example into a consumer-owned dialog.
   */
  onFocusReturn?: () => void
  /**
   * Localizes the visible and announced selection count, including zero.
   */
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
  const active = selectedCount > 0

  // Recover only focus lost to removed actions, never steal it from a dialog or
  // another control. The action owner decides where focus should return.
  useLayoutEffect(() => {
    const element = focusedAction.current
    if (element && !element.isConnected) {
      focusedAction.current = null
      const document = element.ownerDocument
      if (document.activeElement === document.body) {
        onFocusReturn?.()
      }
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
        if (!event.defaultPrevented) {
          onFocusCapture?.(event)
        }
      }}
      onBlurCapture={event => {
        // A blur to non-focusable content has no relatedTarget. Only retain a
        // detached target, whose removal may require focus recovery.
        if (event.target.isConnected) {
          focusedAction.current = null
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
