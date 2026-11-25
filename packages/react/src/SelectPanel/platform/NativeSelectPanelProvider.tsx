import React from 'react'
import {useFeatureFlag} from '../../FeatureFlags'
import {NativeSelectPanelContext, nativeSelectPanelCapabilities} from './NativeSelectPanelContext'

const subscribe = () => () => {}
const serverCapabilities = () => 'unsupported'

export function NativeSelectPanelProvider({children, enabled = true}: {children: React.ReactNode; enabled?: boolean}) {
  const dialogFlag = useFeatureFlag('primer_react_select_panel_native_dialog')
  const invokersFlag = useFeatureFlag('primer_react_select_panel_native_invokers')
  const capabilities = React.useSyncExternalStore(subscribe, nativeSelectPanelCapabilities, serverCapabilities)
  const [targetId, setTargetId] = React.useState<string>()
  const [modal, setModal] = React.useState(false)
  return (
    <NativeSelectPanelContext.Provider
      value={{
        dialog: enabled && dialogFlag && capabilities !== 'unsupported',
        invokers: enabled && dialogFlag && invokersFlag && capabilities === 'invokers',
        targetId,
        setTargetId,
        modal,
        setModal,
      }}
    >
      {children}
    </NativeSelectPanelContext.Provider>
  )
}
