'use client'

import React from 'react'
import {cn} from '../../internal/cn'
import {
  UnderlineItemContent,
  underlineItemClassName,
  underlineListClassName,
  underlineRootClassName,
} from '../../internal/UnderlineItemContent'
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
  type TabListProps,
  type TabPanelProps,
  type TabProps,
  type TabsProps,
} from '../Tabs'
import {TabsMarkerProvider} from '../Tabs/Tabs'

type UnderlinePanelsContextValue = {loadingCounters: boolean}
const UnderlinePanelsContext = React.createContext<UnderlinePanelsContextValue>({loadingCounters: false})

export interface UnderlinePanelsProps extends TabsProps {
  /** Shows placeholders in place of tab counters while their values load. */
  loadingCounters?: boolean
}

const Root = React.forwardRef<HTMLElement, UnderlinePanelsProps>(function UnderlinePanels(
  {className, loadingCounters = false, ...props},
  ref,
) {
  return (
    <UnderlinePanelsContext.Provider value={{loadingCounters}}>
      <TabsMarkerProvider
        markers={{
          root: 'UnderlinePanels',
          list: 'UnderlinePanels.List',
          tab: 'UnderlinePanels.Tab',
          panel: 'UnderlinePanels.Panel',
        }}
      >
        <Tabs {...props} ref={ref} className={cn('w-full', className)} />
      </TabsMarkerProvider>
    </UnderlinePanelsContext.Provider>
  )
})

export type UnderlinePanelsListProps = TabListProps
const List = React.forwardRef<HTMLElement, UnderlinePanelsListProps>(function UnderlinePanelsList(
  {className, ...props},
  ref,
) {
  return (
    <div data-component="UnderlinePanels.ListWrapper" className={cn(underlineRootClassName, 'px-4')}>
      <TabList {...props} ref={ref} className={cn(underlineListClassName, className)} />
    </div>
  )
})

export interface UnderlinePanelsTabProps extends TabProps {
  /** Icon component shown before the tab's label. */
  icon?: React.ElementType
  /** Visual shown before the tab's label, as an alternative to `icon`. */
  leadingVisual?: React.ReactNode
  /** Number shown after the tab's label. */
  counter?: React.ReactNode
}
const PanelTab = React.forwardRef<HTMLElement, UnderlinePanelsTabProps>(function UnderlinePanelsTab(
  {className, counter, icon: Icon, leadingVisual, children, ...props},
  ref,
) {
  const {loadingCounters} = React.useContext(UnderlinePanelsContext)
  return (
    <Tab {...props} ref={ref} className={cn(underlineItemClassName, className)}>
      <UnderlineItemContent
        counter={counter}
        leadingVisual={leadingVisual ?? (Icon ? <Icon /> : null)}
        loadingCounters={loadingCounters}
        marker="UnderlinePanels.Tab"
      >
        {children}
      </UnderlineItemContent>
    </Tab>
  )
})

export type UnderlinePanelsPanelProps = TabPanelProps
const Panel = React.forwardRef<HTMLDivElement, UnderlinePanelsPanelProps>(function UnderlinePanelsPanel(props, ref) {
  return <TabPanel {...props} ref={ref} />
})

export const UnderlinePanels = Object.assign(Root, {List, Tab: PanelTab, Panel})
Root.displayName = 'UnderlinePanels'
List.displayName = 'UnderlinePanels.List'
PanelTab.displayName = 'UnderlinePanels.Tab'
Panel.displayName = 'UnderlinePanels.Panel'
;('use client')
