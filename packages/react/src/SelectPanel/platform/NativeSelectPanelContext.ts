import React from 'react'
import {reactMajorVersion} from '../../utils/environment'

interface NativeSelectPanelState {
  dialog: boolean
  invokers: boolean
  modal: boolean
  targetId?: string
  setTargetId: (id: string | undefined) => void
  setModal: (modal: boolean) => void
}

export const NativeSelectPanelContext = React.createContext<NativeSelectPanelState>({
  dialog: false,
  invokers: false,
  modal: false,
  setTargetId: (_id: string | undefined) => {},
  setModal: (_modal: boolean) => {},
})

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
  return typeof CommandEvent !== 'undefined' &&
    'command' in HTMLButtonElement.prototype &&
    'commandForElement' in HTMLButtonElement.prototype
    ? 'invokers'
    : 'dialog'
}

export function useNativeSelectPanel() {
  return React.useContext(NativeSelectPanelContext)
}

export function nativeInvokerProps(
  targetId: string,
  command: 'show-modal' | 'close' | 'toggle-popover' | 'hide-popover',
) {
  return {
    command,
    ...(reactMajorVersion >= 19 ? {commandFor: targetId} : {commandfor: targetId}),
  }
}
