import React from 'react'
import {reactMajorVersion} from '../../utils/environment'

interface NativeSelectPanelState {
  dialog: boolean
  invokers: boolean
  targetId?: string
  setTargetId: (id: string | undefined) => void
}

export const NativeSelectPanelContext = React.createContext<NativeSelectPanelState>({
  dialog: false,
  invokers: false,
  setTargetId: (_id: string | undefined) => {},
})

export function nativeSelectPanelCapabilities() {
  if (typeof HTMLDialogElement === 'undefined' || typeof HTMLDialogElement.prototype.showModal !== 'function') {
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

export function nativeInvokerProps(targetId: string, command: 'show-modal' | 'close') {
  return {
    command,
    ...(reactMajorVersion >= 19 ? {commandFor: targetId} : {commandfor: targetId}),
  }
}
