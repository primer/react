import {Tabs, TabList, Tab, TabPanel} from './Tabs'

const ComposedTabs = Object.assign(Tabs, {
  TabList,
  Tab,
  TabPanel,
})

export {ComposedTabs as Tabs}
export type {TabsProps, TabListProps, TabProps, TabPanelProps} from './Tabs'
