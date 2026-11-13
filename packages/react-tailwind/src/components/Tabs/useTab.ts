'use client'

import {type Tabs as BaseTabs} from '@base-ui/react/tabs'
import React from 'react'

export type TabHookProps = React.ComponentPropsWithoutRef<typeof BaseTabs.Tab>

/** Returns props for a Base UI tab without duplicating its selection behavior. */
export function useTab(props: TabHookProps) {
  return React.useMemo(() => ({tabProps: props}), [props])
}
