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

export function supportsNativeInvokers() {
  return (
    typeof CommandEvent !== 'undefined' &&
    typeof HTMLButtonElement !== 'undefined' &&
    'command' in HTMLButtonElement.prototype &&
    'commandForElement' in HTMLButtonElement.prototype
  )
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
