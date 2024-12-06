import React from 'react'
import {Tabs, TabList, Tab, TabPanel} from '../Tabs'

export default {
  title: 'Private/Components/Tabs',
  component: Tabs,
}

export const Default = () => {
  return (
    <Tabs defaultValue="one">
      <TabList aria-label="Tabs">
        <Tab value="one">One</Tab>
        <Tab value="two">Two</Tab>
        <Tab value="three">Three</Tab>
      </TabList>
      <TabPanel value="one">Panel one</TabPanel>
      <TabPanel value="two">Panel two</TabPanel>
      <TabPanel value="three">Panel three</TabPanel>
    </Tabs>
  )
}
