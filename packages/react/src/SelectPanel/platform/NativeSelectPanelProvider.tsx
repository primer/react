import React from 'react'
import {useFeatureFlag} from '../../FeatureFlags'
import {NativeSelectPanelContext, nativeSelectPanelCapabilities} from './NativeSelectPanelContext'

const subscribe = () => () => {}
const serverCapabilities = () => 'unsupported'

export function NativeSelectPanelProvider({children, enabled = true}: {children: React.ReactNode; enabled?: boolean}) {
  const dialogFlag = useFeatureFlag('primer_react_select_panel_native_dialog')
  const capabilities = React.useSyncExternalStore(subscribe, nativeSelectPanelCapabilities, serverCapabilities)
  return (
    <NativeSelectPanelContext.Provider
      value={{
        dialog: enabled && dialogFlag && capabilities !== 'unsupported',
      }}
    >
      {children}
    </NativeSelectPanelContext.Provider>
  )
}
