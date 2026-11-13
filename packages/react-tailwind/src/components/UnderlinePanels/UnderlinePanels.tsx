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

export interface UnderlinePanelsProps extends Omit<TabsProps, 'defaultValue' | 'onChange' | 'value'> {
  /** Value of the selected tab when controlled. Update it from `onChange` or `onValueChange`. */
  value?: string
  /** Value of the tab selected on first render when uncontrolled. */
  defaultValue?: string
  /**
   * Called with the newly selected tab's `value` when a user selects a different tab. Automatic fallbacks,
   * such as a missing or disabled selection, and re-selecting the current tab do not call it.
   */
  onChange?: (details: {value: string}) => void
  /** Shows placeholders in place of tab counters while their values load. */
  loadingCounters?: boolean
}

const Root = React.forwardRef<HTMLElement, UnderlinePanelsProps>(function UnderlinePanels(
  {className, loadingCounters = false, onChange, onValueChange, ...props},
  ref,
) {
  const handleValueChange: TabsProps['onValueChange'] = (value, eventDetails) => {
    onValueChange?.(value, eventDetails)
    if (eventDetails.reason === 'none' && !eventDetails.isCanceled) onChange?.({value})
  }

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
        <Tabs {...props} ref={ref} className={cn('primer:w-full', className)} onValueChange={handleValueChange} />
      </TabsMarkerProvider>
    </UnderlinePanelsContext.Provider>
  )
})

export interface UnderlinePanelsListProps extends TabListProps {
  /** Styles the outer layout and bottom-border wrapper without changing the tablist's className or ref. */
  wrapperClassName?: string
}
const List = React.forwardRef<HTMLElement, UnderlinePanelsListProps>(function UnderlinePanelsList(
  {className, wrapperClassName, ...props},
  ref,
) {
  return (
    <div
      data-component="UnderlinePanels.ListWrapper"
      className={cn(underlineRootClassName, 'primer:px-4', wrapperClassName)}
    >
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
