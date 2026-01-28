import type {Meta} from '@storybook/react-vite'
import {action} from 'storybook/actions'
import React from 'react'
import {Tabs, TabList, Tab, TabPanel} from './Tabs'
import Flash from '../../Flash'

const meta = {
  title: 'Experimental/Components/Tabs/Features',
  component: Tabs,
} satisfies Meta<typeof Tabs>

export default meta

export const Uncontrolled = () => (
  <Tabs
    defaultValue="one"
    onValueChange={({value}) => {
      action('onValueChange')({value})
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
)

export const Controlled = () => {
  const [value, setValue] = React.useState('one')
  return (
    <>
      <Tabs
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

export const Vertical = () => (
  <>
    <Flash style={{marginBottom: '16px'}}>
      This example shows the `Tabs` component with `aria-orientation` set to `vertical`, which changes the keyboard
      navigation to Up/Down arrows.
    </Flash>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
      }}
    >
      <Tabs
        defaultValue="one"
        onValueChange={({value}) => {
          action('onValueChange')({value})
        }}
      >
        <TabList
          aria-orientation="vertical"
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
          aria-label="Tabs"
        >
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
          <Tab value="three">Three</Tab>
        </TabList>
        <TabPanel value="one">Panel one</TabPanel>
        <TabPanel value="two">Panel two</TabPanel>
        <TabPanel value="three">Panel three</TabPanel>
      </Tabs>
    </div>
  </>
)
