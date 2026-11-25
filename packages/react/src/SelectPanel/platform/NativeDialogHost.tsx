import React from 'react'
import {FormControlContext} from '../../FormControl/_FormControlContext'
import useLayoutEffect from '../../utils/useIsomorphicLayoutEffect'
import {ParentPanelContext, SelectPanelDialogContext, useSelectPanelContext} from '../SelectPanelContext'
import classes from './PlatformSelectPanel.module.css'
import type {SelectPanelDismissReason} from '../useSelectPanel'
import {useMergedRefs} from '../../hooks/useMergedRefs'
import {useOnOutsideClick, type TouchOrMouseEvent} from '../../hooks/useOnOutsideClick'
import {useBodyScrollLock} from '../../internal/hooks/useBodyScrollLock'
import {useDevOnlyEffect} from '../../internal/hooks/useDevOnlyEffect'
import {warning} from '../../utils/warning'

interface NativeDialogHostProps {
  children: React.ReactNode
  modal: boolean
  dialogRef?: React.RefObject<HTMLDialogElement | null>
  dialogProps?: React.ComponentPropsWithoutRef<'dialog'> & {'data-variant'?: string; 'data-configured'?: string}
  anchorRef?: React.RefObject<HTMLElement | null>
  returnFocusRef?: React.RefObject<HTMLElement | null>
  initialFocusRef?: React.RefObject<HTMLElement | null>
  ignoreClickRefs?: React.RefObject<HTMLElement | null>[]
  onDismiss?: (reason: SelectPanelDismissReason, event?: Event) => void
}

const openHosts = new WeakMap<Document, Set<HTMLDialogElement>>()

function isTopHost(dialog: HTMLDialogElement) {
  return Array.from(openHosts.get(dialog.ownerDocument) ?? []).at(-1) === dialog
}

function NativeOutsideClick({
  containerRef,
  dialogRef,
  ignoreClickRefs,
  onClickOutside,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>
  dialogRef: React.RefObject<HTMLDialogElement | null>
  ignoreClickRefs: React.RefObject<HTMLElement | null>[]
  onClickOutside: (event: TouchOrMouseEvent) => void
}) {
  useOnOutsideClick({
    containerRef,
    ignoreClickRefs,
    onClickOutside: event => {
      if (dialogRef.current && isTopHost(dialogRef.current)) onClickOutside(event)
    },
  })
  return null
}

function restoreFocus(
  anchor: HTMLElement | null,
  parentInputRef?: React.RefObject<HTMLElement | null>,
  parentAnchorRef?: React.RefObject<HTMLElement | null>,
) {
  if (anchor?.isConnected) anchor.focus()
  else (parentInputRef?.current ?? parentAnchorRef?.current)?.focus()
}

/**
 * The top layer is shared by non-modal popovers and genuinely modal dialogs.
 * Only the latter delegate focus containment and background inertness to the UA.
 */
export function NativeDialogHost({
  children,
  modal,
  dialogRef: externalDialogRef,
  dialogProps,
  anchorRef: externalAnchorRef,
  returnFocusRef,
  initialFocusRef: externalInitialFocusRef,
  ignoreClickRefs,
  onDismiss,
}: NativeDialogHostProps) {
  const state = useSelectPanelContext()
  const parent = React.useContext(ParentPanelContext)
  const dialogRef = React.useRef<HTMLDialogElement>(null)
  const layerRef = React.useRef<HTMLDivElement>(null)
  const ref = useMergedRefs<HTMLDialogElement>(dialogRef, externalDialogRef)
  useBodyScrollLock(dialogRef, state.open && modal)
  const anchorRef = externalAnchorRef ?? state.anchorRef
  const initialFocusRef = externalInitialFocusRef ?? state.inputRef
  const previousFocus = React.useRef<HTMLElement | null>(null)
  const initialFocusApplied = React.useRef(false)
  const wasOpen = React.useRef(false)
  const restoreFocusOnClose = React.useRef(true)
  const focusReturnTarget = () => {
    restoreFocus(
      returnFocusRef?.current ?? anchorRef.current ?? previousFocus.current,
      parent?.inputRef,
      parent?.anchorRef,
    )
  }
  const [, reconcile] = React.useReducer((revision: number) => revision + 1, 0)
  const latestState = React.useRef(state)
  const dismiss = (reason: SelectPanelDismissReason, event?: Event) => {
    // Let the mousedown's default action focus the clicked background control.
    // Neither reconciliation nor a later native close event may take it back.
    restoreFocusOnClose.current = modal || reason !== 'click-outside'
    if (onDismiss) onDismiss(reason, event)
    else state.dismiss(reason)
  }
  const latestHandlers = React.useRef({dismiss, modal, initialFocusRef})

  useDevOnlyEffect(() => {
    const element = dialogRef.current
    if (!state.open || !element || dialogProps?.['data-configured'] !== undefined) return
    const label = element.getAttribute('aria-label')
    const title = state.labelledByRef.current ?? element.getAttribute('aria-labelledby')
    warning(
      !label && !(title && element.ownerDocument.getElementById(title)?.textContent.trim()),
      'SelectPanel: No accessible name provided. Render a Title, or pass overlayProps aria-label.',
    )
  }, [state.open, state.labelledBy, state.labelledByRef, dialogProps])

  useLayoutEffect(() => {
    latestState.current = state
    latestHandlers.current = {dismiss, modal, initialFocusRef}
  })

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!state.open || !dialog) return
    const hosts = openHosts.get(dialog.ownerDocument) ?? new Set<HTMLDialogElement>()
    hosts.add(dialog)
    openHosts.set(dialog.ownerDocument, hosts)
    return () => {
      hosts.delete(dialog)
      if (hosts.size === 0) openHosts.delete(dialog.ownerDocument)
    }
  }, [state.open])

  // Run after every commit, including external native open/close changes.
  useLayoutEffect(() => {
    const dialog = dialogRef.current
    // A Portal attaches its container in the parent's layout effect, after
    // this child's first layout effect. Its onMount schedules a connected pass.
    if (!dialog?.isConnected) return
    // React 18's autoFocus focuses at mount, which is too early for a closed
    // native host. Native opening needs the real autofocus attribute.
    initialFocusRef.current?.setAttribute('autofocus', '')
    const popoverOpen = dialog.matches(':popover-open')
    const nativeOpen = dialog.open || popoverOpen
    const correctlyOpen = modal ? dialog.matches(':modal') : popoverOpen
    if (state.open && !correctlyOpen) {
      const activeElement = dialog.ownerDocument.activeElement
      const focusedChild =
        nativeOpen && activeElement instanceof HTMLElement && dialog.contains(activeElement) ? activeElement : null
      if (!wasOpen.current) {
        previousFocus.current = activeElement instanceof HTMLElement ? activeElement : null
      }
      if (popoverOpen) dialog.hidePopover()
      if (dialog.open) dialog.close()
      if (wasOpen.current && !nativeOpen) initialFocusApplied.current = false
      if (modal) dialog.showModal()
      else dialog.showPopover()
      if (focusedChild && dialog.ownerDocument.activeElement !== focusedChild) focusedChild.focus()
    } else if (!state.open) {
      if (popoverOpen) dialog.hidePopover()
      if (dialog.open) dialog.close()
      if ((wasOpen.current || nativeOpen) && restoreFocusOnClose.current) focusReturnTarget()
    }
    // Apply initial focus once its ref exists. Never refocus it on unrelated
    // selection/filter renders.
    if (state.open && !initialFocusApplied.current && initialFocusRef.current) {
      if (dialog.ownerDocument.activeElement !== initialFocusRef.current) initialFocusRef.current.focus()
      initialFocusApplied.current = true
    } else if (!state.open) {
      initialFocusApplied.current = false
    }
    wasOpen.current = state.open
  })

  React.useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    let escapeKey: KeyboardEvent | undefined

    const keydown = (event: KeyboardEvent) => {
      escapeKey = event.key === 'Escape' ? event : undefined
    }
    const focusin = (event: FocusEvent) => {
      if (event.target === latestHandlers.current.initialFocusRef.current) initialFocusApplied.current = true
    }

    const cancel = (event: Event) => {
      // Escape must request a controlled transition, not close behind Root's back.
      event.preventDefault()
      if (latestHandlers.current.modal) latestHandlers.current.dismiss('escape', escapeKey ?? event)
      escapeKey = undefined
    }
    const nativeChange = () => {
      reconcile()
    }
    const documentKeydown = (event: KeyboardEvent) => {
      if (
        event.key !== 'Escape' ||
        event.defaultPrevented ||
        latestHandlers.current.modal ||
        !latestState.current.open ||
        !isTopHost(dialog)
      )
        return
      event.preventDefault()
      event.stopPropagation()
      latestHandlers.current.dismiss('escape', event)
    }
    dialog.addEventListener('cancel', cancel)
    dialog.addEventListener('keydown', keydown)
    dialog.addEventListener('focusin', focusin)
    dialog.addEventListener('close', nativeChange)
    dialog.addEventListener('toggle', nativeChange)
    dialog.ownerDocument.addEventListener('keydown', documentKeydown)
    return () => {
      dialog.removeEventListener('cancel', cancel)
      dialog.removeEventListener('keydown', keydown)
      dialog.removeEventListener('focusin', focusin)
      dialog.removeEventListener('close', nativeChange)
      dialog.removeEventListener('toggle', nativeChange)
      dialog.ownerDocument.removeEventListener('keydown', documentKeydown)
    }
  }, [])

  const parentInputRef = parent?.inputRef
  const parentAnchorRef = parent?.anchorRef
  React.useEffect(() => {
    const anchor = returnFocusRef?.current ?? anchorRef.current ?? previousFocus.current
    return () => {
      if (wasOpen.current && restoreFocusOnClose.current) restoreFocus(anchor, parentInputRef, parentAnchorRef)
    }
  }, [anchorRef, returnFocusRef, parentInputRef, parentAnchorRef])

  return (
    <div ref={layerRef} className={classes.NativeLayer}>
      {state.open && !modal ? (
        <NativeOutsideClick
          containerRef={layerRef}
          dialogRef={dialogRef}
          ignoreClickRefs={[anchorRef, ...(ignoreClickRefs ?? [])]}
          onClickOutside={event => dismiss('click-outside', event)}
        />
      ) : null}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Native dialogs handle Escape and modal backdrop activation. */}
      <dialog
        ref={ref}
        id={state.panelId}
        aria-labelledby={state.labelledBy}
        aria-describedby={state.describedBy}
        className={classes.Dialog}
        data-platform-host="native-dialog"
        {...dialogProps}
        {...{popover: 'manual'}}
        aria-modal={modal ? true : undefined}
        onKeyDown={event => {
          dialogProps?.onKeyDown?.(event)
          // Keep the native cancel default action, but do not let an enclosing
          // legacy Dialog's document Escape registry prevent that action.
          if (event.key === 'Escape') {
            event.stopPropagation()
            if (!modal && !event.defaultPrevented && isTopHost(event.currentTarget)) {
              event.preventDefault()
              dismiss('escape', event.nativeEvent)
            }
          }
        }}
        onClick={event => {
          dialogProps?.onClick?.(event)
          if (!modal || event.defaultPrevented || event.target !== event.currentTarget) return
          const {left, right, top, bottom} = event.currentTarget.getBoundingClientRect()
          if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) {
            dismiss('click-outside', event.nativeEvent)
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
