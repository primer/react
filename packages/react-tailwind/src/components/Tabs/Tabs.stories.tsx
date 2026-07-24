import {Tab, TabList, TabPanel, Tabs} from './Tabs'
export default {title: 'Navigation/Tabs', component: Tabs}
export const Default = () => (
  <Tabs defaultValue="code">
    <TabList aria-label="View">
      <Tab value="code">Code</Tab>
      <Tab value="issues">Issues</Tab>
    </TabList>
    <TabPanel value="code">Code panel</TabPanel>
    <TabPanel value="issues">Issues panel</TabPanel>
  </Tabs>
)
