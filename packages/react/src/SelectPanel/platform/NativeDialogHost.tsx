import React from 'react'
import {FormControlContext} from '../../FormControl/_FormControlContext'
import useLayoutEffect from '../../utils/useIsomorphicLayoutEffect'
import {ParentPanelContext, SelectPanelDialogContext, useSelectPanelContext} from '../SelectPanelContext'
import classes from './PlatformSelectPanel.module.css'
import type {SelectPanelDismissReason} from '../useSelectPanel'
import {useMergedRefs} from '../../hooks/useMergedRefs'

interface NativeDialogHostProps {
  children: React.ReactNode
  invokers: boolean
  dialogRef?: React.RefObject<HTMLDialogElement | null>
  dialogProps?: React.ComponentPropsWithoutRef<'dialog'> & {
    'data-variant'?: string
    'data-configured'?: string
    'data-anchor-position'?: boolean
    'data-side'?: string
    'data-align'?: string
  }
  anchorRef?: React.RefObject<HTMLElement | null>
  returnFocusRef?: React.RefObject<HTMLElement | null>
  initialFocusRef?: React.RefObject<HTMLElement | null>
  onDismiss?: (reason: SelectPanelDismissReason, event?: Event) => void
  onCommandOpen?: () => void
}

const scrollLocks = new WeakMap<Document, {count: number; overflow: string}>()

function lockScrolling(ownerDocument: Document) {
  const lock = scrollLocks.get(ownerDocument) ?? {count: 0, overflow: ownerDocument.body.style.overflow}
  lock.count += 1
  scrollLocks.set(ownerDocument, lock)
  ownerDocument.body.style.overflow = 'hidden'
  return () => {
    lock.count -= 1
    if (lock.count === 0) {
      ownerDocument.body.style.overflow = lock.overflow
      scrollLocks.delete(ownerDocument)
    }
  }
}

function restoreFocus(
  anchor: HTMLElement | null,
  parentInputRef?: React.RefObject<HTMLElement | null>,
  parentAnchorRef?: React.RefObject<HTMLElement | null>,
) {
  if (anchor?.isConnected) anchor.focus()
  else (parentInputRef?.current ?? parentAnchorRef?.current)?.focus()
}

function isBackdropEvent(event: React.MouseEvent<HTMLDialogElement>) {
  if (event.target !== event.currentTarget) return false
  const {left, right, top, bottom} = event.currentTarget.getBoundingClientRect()
  return event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom
}

/**
 * The browser alone owns focus containment and background inertness.
 */
export function NativeDialogHost({
  children,
  invokers,
  dialogRef: externalDialogRef,
  dialogProps,
  anchorRef: externalAnchorRef,
  returnFocusRef,
  initialFocusRef: externalInitialFocusRef,
  onDismiss,
  onCommandOpen,
}: NativeDialogHostProps) {
  const state = useSelectPanelContext()
  const parent = React.useContext(ParentPanelContext)
  const dialogRef = React.useRef<HTMLDialogElement>(null)
  const ref = useMergedRefs<HTMLDialogElement>(dialogRef, externalDialogRef)
  const anchorRef = externalAnchorRef ?? state.anchorRef
  const initialFocusRef = externalInitialFocusRef ?? state.inputRef
  const previousFocus = React.useRef<HTMLElement | null>(null)
  const initialFocusApplied = React.useRef(false)
  const focusReturnTarget = () => {
    restoreFocus(
      returnFocusRef?.current ?? anchorRef.current ?? previousFocus.current,
      parent?.inputRef,
      parent?.anchorRef,
    )
  }
  const [, reconcile] = React.useReducer((revision: number) => revision + 1, 0)
  const latestState = React.useRef(state)
  const latestHandlers = React.useRef({onDismiss, onCommandOpen})
  const commandInFlight = React.useRef(false)

  useLayoutEffect(() => {
    latestState.current = state
    latestHandlers.current = {onDismiss, onCommandOpen}
  })

  // Run after *every* commit, including a rejected command transition. A Root
  // controlled by a consumer may reject without producing a render of its own.
  useLayoutEffect(() => {
    const dialog = dialogRef.current
    // A Portal attaches its container in the parent's layout effect, after
    // this child's first layout effect. Its onMount schedules a connected pass.
    if (!dialog?.isConnected) return
    // React 18's autoFocus focuses at mount, which is too early for a closed
    // invoker target. Native showModal needs the real autofocus attribute.
    initialFocusRef.current?.setAttribute('autofocus', '')
    if (state.open && !dialog.open) {
      previousFocus.current =
        dialog.ownerDocument.activeElement instanceof HTMLElement ? dialog.ownerDocument.activeElement : null
      dialog.showModal()
    } else if (!state.open && dialog.open) {
      dialog.close()
      focusReturnTarget()
    }
    // A native invoker opens before React commits the configured collection.
    // Apply initial focus once its ref exists, even if the browser already
    // opened the host. Never refocus it on unrelated selection/filter renders.
    if (state.open && !initialFocusApplied.current && initialFocusRef.current) {
      initialFocusRef.current.focus()
      initialFocusApplied.current = true
    } else if (!state.open) {
      initialFocusApplied.current = false
    }
    commandInFlight.current = false
  })

  React.useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const commandTimers = new Set<ReturnType<typeof setTimeout>>()
    let escapeKey: KeyboardEvent | undefined

    const keydown = (event: KeyboardEvent) => {
      escapeKey = event.key === 'Escape' ? event : undefined
    }

    const cancel = (event: Event) => {
      // Escape must request a controlled transition, not close behind Root's back.
      event.preventDefault()
      if (latestHandlers.current.onDismiss) latestHandlers.current.onDismiss('escape', escapeKey ?? event)
      else latestState.current.dismiss('escape')
      escapeKey = undefined
    }
    const close = () => {
      // The command task will reconcile after the browser's default action.
      // Do not mistake its accepted close for an external dialog.close().
      if (commandInFlight.current) return
      const current = latestState.current
      if (current.open && !dialog.open) {
        // Includes external dialog.close() and rejected native close commands.
        dialog.showModal()
        initialFocusRef.current?.focus()
      } else if (!current.open && !dialog.open) {
        restoreFocus(
          returnFocusRef?.current ?? anchorRef.current ?? previousFocus.current,
          parent?.inputRef,
          parent?.anchorRef,
        )
      }
    }
    const command = (event: Event) => {
      if (event.target !== dialog) return
      if (!(event instanceof CommandEvent)) return
      if (event.command !== 'show-modal' && event.command !== 'close') return
      const nextOpen = event.command === 'show-modal'
      commandInFlight.current = true
      // Use a task, NOT a microtask: a native dispatch may perform a microtask
      // checkpoint between listeners, before consumer cancellation / UA default.
      // Neither button nor this listener cancels the command's native action.
      const timer = setTimeout(() => {
        commandTimers.delete(timer)
        if (!dialog.isConnected) return
        if (!event.defaultPrevented) {
          const current = latestState.current
          if (nextOpen) {
            if (latestHandlers.current.onCommandOpen) latestHandlers.current.onCommandOpen()
            else current.requestOpenChange(true, 'anchor-click')
          } else if (latestHandlers.current.onDismiss) latestHandlers.current.onDismiss('close')
          else current.dismiss('close')
        }
        reconcile()
      }, 0)
      commandTimers.add(timer)
    }
    dialog.addEventListener('cancel', cancel)
    dialog.addEventListener('keydown', keydown)
    dialog.addEventListener('close', close)
    if (invokers) dialog.addEventListener('command', command)
    return () => {
      dialog.removeEventListener('cancel', cancel)
      dialog.removeEventListener('keydown', keydown)
      dialog.removeEventListener('close', close)
      if (invokers) dialog.removeEventListener('command', command)
      for (const timer of commandTimers) clearTimeout(timer)
    }
  }, [invokers, dialogRef, anchorRef, initialFocusRef, returnFocusRef, parent])

  React.useEffect(() => {
    if (!state.open) return
    const ownerDocument = dialogRef.current?.ownerDocument
    if (!ownerDocument) return
    return lockScrolling(ownerDocument)
  }, [state.open])

  const parentInputRef = parent?.inputRef
  const parentAnchorRef = parent?.anchorRef
  React.useEffect(() => {
    const anchor = returnFocusRef?.current ?? anchorRef.current ?? previousFocus.current
    const dialog = dialogRef.current
    return () => {
      // Removing an open modal clears native inertness; restore its invoker too.
      if (dialog?.open) restoreFocus(anchor, parentInputRef, parentAnchorRef)
    }
  }, [anchorRef, returnFocusRef, parentInputRef, parentAnchorRef])

  return (
    <div className={classes.NativeLayer}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Native dialogs handle backdrop clicks and scoped Escape. */}
      <dialog
        ref={ref}
        id={state.panelId}
        aria-modal="true"
        aria-labelledby={state.labelledBy}
        aria-describedby={state.describedBy}
        className={classes.NativeHost}
        data-platform-host="native-dialog"
        {...dialogProps}
        onKeyDown={event => {
          dialogProps?.onKeyDown?.(event)
          // Keep the native cancel default action, but do not let an enclosing
          // legacy Dialog's document Escape registry prevent that action.
          if (event.key === 'Escape') event.stopPropagation()
        }}
        onPointerDown={event => {
          dialogProps?.onPointerDown?.(event)
          // A rejected controlled dismissal must not move focus to the host.
          if (!event.defaultPrevented && isBackdropEvent(event)) event.preventDefault()
        }}
        onClick={event => {
          dialogProps?.onClick?.(event)
          if (!event.defaultPrevented && isBackdropEvent(event)) {
            if (onDismiss) onDismiss('click-outside', event.nativeEvent)
            else state.dismiss('click-outside')
          }
        }}
      >
        <SelectPanelDialogContext.Provider value={true}>
          <FormControlContext.Provider value={null}>{children}</FormControlContext.Provider>
        </SelectPanelDialogContext.Provider>
      </dialog>
    </div>
  )
}
