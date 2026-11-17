import React from 'react'
import {NativeSelectPanelContext, supportsNativeInvokers} from './NativeSelectPanelContext'

const subscribe = () => () => {}
const serverCapabilities = () => false

export function NativeSelectPanelProvider({children, enabled = true}: {children: React.ReactNode; enabled?: boolean}) {
  const invokers = React.useSyncExternalStore(subscribe, supportsNativeInvokers, serverCapabilities)
  const [targetId, setTargetId] = React.useState<string>()
  return (
    <NativeSelectPanelContext.Provider
      value={{
        dialog: enabled,
        invokers: enabled && invokers,
        targetId,
        setTargetId,
      }}
    >
      {children}
    </NativeSelectPanelContext.Provider>
  )
}
