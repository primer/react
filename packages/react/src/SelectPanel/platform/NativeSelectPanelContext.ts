import React from 'react'
import type {SelectPanelDismissReason} from '../useSelectPanel'

interface NativeSelectPanelState {
  dialog: boolean
}

export const NativeSelectPanelContext = React.createContext<NativeSelectPanelState>({
  dialog: false,
})

export const NativeSelectPanelDismissContext = React.createContext<{
  id: string
  dismiss: (reason: SelectPanelDismissReason, event?: Event) => void
} | null>(null)

export function nativeSelectPanelCapabilities() {
  if (
    typeof HTMLDialogElement === 'undefined' ||
    typeof HTMLDialogElement.prototype.showModal !== 'function' ||
    typeof HTMLElement.prototype.showPopover !== 'function' ||
    typeof HTMLElement.prototype.hidePopover !== 'function' ||
    !('popover' in HTMLElement.prototype) ||
    typeof ToggleEvent === 'undefined' ||
    typeof CSS === 'undefined' ||
    !CSS.supports('selector(:popover-open)')
  ) {
    return 'unsupported'
  }
  return 'dialog'
}

export function useNativeSelectPanel() {
  return React.useContext(NativeSelectPanelContext)
}
