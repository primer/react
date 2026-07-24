import React from 'react'
import {cn} from '../../internal/cn'
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

export type UnderlinePanelsProps = TabsProps

const Root = React.forwardRef<HTMLElement, UnderlinePanelsProps>(function UnderlinePanels({className, ...props}, ref) {
  return (
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
  )
})

export type UnderlinePanelsListProps = TabListProps
const List = React.forwardRef<HTMLElement, UnderlinePanelsListProps>(function UnderlinePanelsList(
  {className, ...props},
  ref,
) {
  return <TabList {...props} ref={ref} className={cn('overflow-x-auto', className)} />
})

export interface UnderlinePanelsTabProps extends TabProps {
  leadingVisual?: React.ReactNode
  counter?: React.ReactNode
}
const PanelTab = React.forwardRef<HTMLElement, UnderlinePanelsTabProps>(function UnderlinePanelsTab(
  {className, counter, leadingVisual, children, ...props},
  ref,
) {
  return (
    <Tab {...props} ref={ref} className={cn('shrink-0', className)}>
      {leadingVisual ? <span aria-hidden="true">{leadingVisual}</span> : null}
      {children}
      {counter === undefined ? null : (
        <span className="rounded-full bg-neutral-muted px-1 text-xs" aria-hidden="true">
          {counter}
        </span>
      )}
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
