import {type Tabs as BaseTabs} from '@base-ui/react/tabs'
import React from 'react'

export type TabPanelHookProps = React.ComponentPropsWithoutRef<typeof BaseTabs.Panel>

/** Returns props for a Base UI tab panel without duplicating its visibility behavior. */
export function useTabPanel(props: TabPanelHookProps) {
  return React.useMemo(() => ({tabPanelProps: props}), [props])
}
