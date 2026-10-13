import React, {useRef} from 'react'
import {clsx} from 'clsx'
import {Button} from '../Button'
import {AriaStatus} from '../live-region'
import VisuallyHidden from '../_VisuallyHidden'
import {mergeProps} from '../utils/mergeProps'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import classes from './TableBulkActions.module.css'

export type TableBulkActionsProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'role'> & {
  /**
   * The number of effectively selected rows. Keep this component mounted at zero
   * so the count announcement and focus recovery can complete.
   */
  selectedCount: number
  /**
   * Requests clearing selection. The consumer owns the selection state.
   */
  onClearSelection: () => void
  /**
   * Restores focus when a focused action disappears. Not called if focus has
   * already moved elsewhere, for example into a consumer-owned dialog.
   */
  onFocusReturn?: () => void
  /**
   * Localizes the visible and announced selection count, including zero.
   */
  getSelectedCountLabel?: (selectedCount: number) => string
  /**
   * Localizes the clear-selection button.
   */
  clearSelectionLabel?: string
}

function defaultSelectedCountLabel(selectedCount: number) {
  return `${selectedCount} ${selectedCount === 1 ? 'row' : 'rows'} selected`
}

const TableBulkActions = React.forwardRef<HTMLDivElement, TableBulkActionsProps>(function TableBulkActions(
  {
    selectedCount,
    onClearSelection,
    onFocusReturn,
    getSelectedCountLabel = defaultSelectedCountLabel,
    clearSelectionLabel = 'Clear selection',
    'aria-label': ariaLabel = 'Bulk actions',
    className,
    children,
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
    <AriaStatus as="span" announceOnShow={active}>
      {getSelectedCountLabel(selectedCount)}
    </AriaStatus>
  )

  return (
    <div
      {...mergeProps(
        {
          onFocusCapture: (event: React.FocusEvent<HTMLDivElement>) => {
            focusedAction.current = event.target
          },
          onBlurCapture: (event: React.FocusEvent<HTMLDivElement>) => {
            if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
              focusedAction.current = null
            }
          },
        },
        rest,
      )}
      ref={ref}
      role={active ? 'group' : undefined}
      aria-label={active ? ariaLabel : undefined}
      data-component="Table.BulkActions"
      data-active={active || undefined}
      className={clsx(classes.TableBulkActions, className)}
    >
      <VisuallyHidden isVisible={active}>{count}</VisuallyHidden>
      {active ? (
        <>
          <Button size="small" onClick={onClearSelection}>
            {clearSelectionLabel}
          </Button>
          <div className={classes.Actions}>{children}</div>
        </>
      ) : null}
    </div>
  )
})

export {TableBulkActions}
