import React from 'react'
import useLayoutEffect from '../../utils/useIsomorphicLayoutEffect'
import type {SelectPanelDismissReason} from '../useSelectPanel'

interface NativeSelectPanelInvokerOptions {
  enabled: boolean
  open: boolean
  modal: boolean
  dialogRef: React.RefObject<HTMLDialogElement | null>
  anchorRef: React.RefObject<HTMLElement | null>
  onOpen: () => void
  onDismiss: (reason: SelectPanelDismissReason, event?: Event) => void
}

/**
 * Optional command enhancement. The host only knows about a pending native
 * transition and saved focus, not commands, invoker flags, or cancellation.
 */
export function useNativeSelectPanelInvokers(options: NativeSelectPanelInvokerOptions) {
  const latest = React.useRef(options)
  const transitionRef = React.useRef(false)
  const previousFocusRef = React.useRef<HTMLElement | null>(null)
  const [, reconcile] = React.useReducer((revision: number) => revision + 1, 0)
  const {enabled, dialogRef, anchorRef} = options

  useLayoutEffect(() => {
    latest.current = options
  })

  React.useEffect(() => {
    const dialog = dialogRef.current
    if (!enabled || !dialog) return
    const timers = new Set<ReturnType<typeof setTimeout>>()
    const command = (event: Event) => {
      // Nested panels may bubble commands; only their own host can handle them.
      if (event.target !== dialog || !(event instanceof CommandEvent)) return
      if (
        event.command !== 'show-modal' &&
        event.command !== 'close' &&
        event.command !== 'show-popover' &&
        event.command !== 'toggle-popover' &&
        event.command !== 'hide-popover'
      )
        return
      const expected = latest.current.modal
        ? event.command === 'show-modal' || event.command === 'close'
        : event.command === 'show-popover' || event.command === 'hide-popover' || event.command === 'toggle-popover'
      if (!expected) {
        event.preventDefault()
        return
      }
      const nextOpen =
        event.command === 'toggle-popover'
          ? !dialog.matches(':popover-open')
          : event.command === 'show-modal' || event.command === 'show-popover'
      if (nextOpen && !latest.current.open) {
        const activeElement = dialog.ownerDocument.activeElement
        previousFocusRef.current = activeElement instanceof HTMLElement ? activeElement : null
      }
      transitionRef.current = true
      // A task, NOT a microtask: native dispatch may checkpoint microtasks
      // between listeners, before consumer cancellation and the UA default.
      const timer = setTimeout(() => {
        timers.delete(timer)
        if (!dialog.isConnected) return
        if (!event.defaultPrevented) {
          if (nextOpen) latest.current.onOpen()
          else latest.current.onDismiss(event.source === anchorRef.current ? 'anchor-click' : 'close', event)
        }
        transitionRef.current = false
        // Controlled consumers can reject without rendering. Always give the
        // host a commit to reconcile against the authoritative React state.
        reconcile()
      }, 0)
      timers.add(timer)
    }
    dialog.addEventListener('command', command)
    return () => {
      dialog.removeEventListener('command', command)
      for (const timer of timers) clearTimeout(timer)
      transitionRef.current = false
    }
  }, [enabled, dialogRef, anchorRef])

  return {transitionRef, previousFocusRef}
}
