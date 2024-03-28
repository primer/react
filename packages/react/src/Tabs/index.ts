import {Tabs as TabsImpl, TabList, Tab, TabPanel} from './Tabs'

export const Tabs = Object.assign(TabsImpl, {
  TabList,
  Tab,
  TabPanel,
})
export type {TabsProps, TabListProps, TabProps, TabPanelProps} from './Tabs'
