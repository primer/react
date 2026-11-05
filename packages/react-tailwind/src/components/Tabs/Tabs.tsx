'use client'

import {Tabs as BaseTabs} from '@base-ui/react/tabs'
import React from 'react'

type TabsMarkers = {
  root: string
  list: string
  tab: string
  panel: string
}

const defaultMarkers: TabsMarkers = {
  root: 'Tabs',
  list: 'Tabs.List',
  tab: 'Tabs.Tab',
  panel: 'Tabs.Panel',
}

const TabsMarkersContext = React.createContext<TabsMarkers>(defaultMarkers)

type TabsActivationMode = 'automatic' | 'manual'

const TabsActivationModeContext = React.createContext<TabsActivationMode>('automatic')

/** @internal Used by composed tab presentations to retain their component markers. */
export function TabsMarkerProvider({children, markers}: {children: React.ReactNode; markers: TabsMarkers}) {
  return <TabsMarkersContext.Provider value={markers}>{children}</TabsMarkersContext.Provider>
}

export type TabsProps = Omit<React.ComponentPropsWithoutRef<typeof BaseTabs.Root>, 'data-component'> & {
  /**
   * Whether arrow-key focus also selects a tab. `automatic` selects the focused tab; `manual` only moves focus,
   * and Enter, Space, or a click commits the selection. An explicit `TabList` `activateOnFocus` takes precedence.
   * @default 'automatic'
   */
  activationMode?: TabsActivationMode
}

export const Tabs = React.forwardRef<HTMLElement, TabsProps>(function Tabs(
  {activationMode = 'automatic', className, ...props},
  ref,
) {
  const markers = React.useContext(TabsMarkersContext)
  return (
    <TabsActivationModeContext.Provider value={activationMode}>
      <BaseTabs.Root
        {...props}
        ref={ref as React.Ref<HTMLDivElement>}
        data-component={markers.root}
        className={className}
      />
    </TabsActivationModeContext.Provider>
  )
})

export type TabListProps = Omit<React.ComponentPropsWithoutRef<typeof BaseTabs.List>, 'data-component'>

export const TabList = React.forwardRef<HTMLElement, TabListProps>(function TabList(
  {className, activateOnFocus, ...props},
  ref,
) {
  const markers = React.useContext(TabsMarkersContext)
  const activationMode = React.useContext(TabsActivationModeContext)
  return (
    <BaseTabs.List
      {...props}
      ref={ref as React.Ref<HTMLDivElement>}
      activateOnFocus={activateOnFocus ?? activationMode === 'automatic'}
      data-component={markers.list}
      className={className}
    />
  )
})

export type TabProps = Omit<React.ComponentPropsWithoutRef<typeof BaseTabs.Tab>, 'data-component'>

export const Tab = React.forwardRef<HTMLElement, TabProps>(function Tab({className, ...props}, ref) {
  const markers = React.useContext(TabsMarkersContext)
  return <BaseTabs.Tab {...props} ref={ref} data-component={markers.tab} className={className} />
})

export type TabPanelProps = Omit<React.ComponentPropsWithoutRef<typeof BaseTabs.Panel>, 'data-component'>

export const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel({className, ...props}, ref) {
  const markers = React.useContext(TabsMarkersContext)
  return <BaseTabs.Panel {...props} ref={ref} data-component={markers.panel} className={className} />
})

Tabs.displayName = 'Tabs'
TabList.displayName = 'Tabs.List'
Tab.displayName = 'Tabs.Tab'
TabPanel.displayName = 'Tabs.Panel'
;('use client')
