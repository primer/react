import React from 'react'
import {Tabs} from '../Tabs'

export default {
  title: 'Private/Components/Tabs',
  component: Tabs,
}

export const Default = () => {
  return (
    <Tabs defaultValue="one">
      <Tabs.TabList aria-label="Tabs">
        <Tabs.Tab value="one">One</Tabs.Tab>
        <Tabs.Tab value="two">Two</Tabs.Tab>
        <Tabs.Tab value="three">Three</Tabs.Tab>
      </Tabs.TabList>
      <Tabs.TabPanel value="one">Panel one</Tabs.TabPanel>
      <Tabs.TabPanel value="two">Panel two</Tabs.TabPanel>
      <Tabs.TabPanel value="three">Panel three</Tabs.TabPanel>
    </Tabs>
  )
}
