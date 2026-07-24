import {Tabs as BaseTabs} from '@base-ui/react/tabs'
import React from 'react'
import {cn} from '../../internal/cn'

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

/** @internal Used by composed tab presentations to retain their component markers. */
export function TabsMarkerProvider({children, markers}: {children: React.ReactNode; markers: TabsMarkers}) {
  return <TabsMarkersContext.Provider value={markers}>{children}</TabsMarkersContext.Provider>
}

export type TabsProps = Omit<React.ComponentPropsWithoutRef<typeof BaseTabs.Root>, 'data-component'>

export const Tabs = React.forwardRef<HTMLElement, TabsProps>(function Tabs({className, ...props}, ref) {
  const markers = React.useContext(TabsMarkersContext)
  return (
    <BaseTabs.Root
      {...props}
      ref={ref as React.Ref<HTMLDivElement>}
      data-component={markers.root}
      className={cn('w-full', className)}
    />
  )
})

export type TabListProps = Omit<React.ComponentPropsWithoutRef<typeof BaseTabs.List>, 'data-component'>

export const TabList = React.forwardRef<HTMLElement, TabListProps>(function TabList(
  {className, activateOnFocus = true, ...props},
  ref,
) {
  const markers = React.useContext(TabsMarkersContext)
  return (
    <BaseTabs.List
      {...props}
      ref={ref as React.Ref<HTMLDivElement>}
      activateOnFocus={activateOnFocus}
      data-component={markers.list}
      className={cn('flex border-b border-default', className)}
    />
  )
})

export type TabProps = Omit<React.ComponentPropsWithoutRef<typeof BaseTabs.Tab>, 'data-component'>

export const Tab = React.forwardRef<HTMLElement, TabProps>(function Tab({className, ...props}, ref) {
  const markers = React.useContext(TabsMarkersContext)
  return (
    <BaseTabs.Tab
      {...props}
      ref={ref}
      data-component={markers.tab}
      className={cn(
        'relative inline-flex min-h-10 items-center gap-2 border-b-2 border-transparent px-3 text-sm text-muted hover:text-default focus-visible:z-10 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-focus data-[active]:border-accent-emphasis data-[active]:font-semibold data-[active]:text-default disabled:cursor-not-allowed disabled:text-disabled',
        className,
      )}
    />
  )
})

export type TabPanelProps = Omit<React.ComponentPropsWithoutRef<typeof BaseTabs.Panel>, 'data-component'>

export const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel({className, ...props}, ref) {
  const markers = React.useContext(TabsMarkersContext)
  return <BaseTabs.Panel {...props} ref={ref} data-component={markers.panel} className={cn('py-4', className)} />
})

Tabs.displayName = 'Tabs'
TabList.displayName = 'Tabs.List'
Tab.displayName = 'Tabs.Tab'
TabPanel.displayName = 'Tabs.Panel'
