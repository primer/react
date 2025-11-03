import type {Meta} from '@storybook/react-vite'
import {action} from 'storybook/actions'
import React from 'react'
import {Tabs, TabList, Tab, TabPanel} from '.'

const meta = {
  title: 'Private/Components/Tabs/Features',
  component: Tabs,
} satisfies Meta<typeof Tabs>

export default meta

export const Controlled = () => {
  const [value, setValue] = React.useState('one')
  return (
    <>
      <Tabs
        defaultValue="one"
        value={value}
        onValueChange={({value}) => {
          action('onValueChange')({value})
          setValue(value)
        }}
      >
        <TabList aria-label="Tabs">
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
          <Tab value="three">Three</Tab>
        </TabList>
        <TabPanel value="one">Panel one</TabPanel>
        <TabPanel value="two">Panel two</TabPanel>
        <TabPanel value="three">Panel three</TabPanel>
      </Tabs>
      <button
        type="button"
        onClick={() => {
          setValue('three')
        }}
      >
        Activate panel three
      </button>
    </>
  )
}
