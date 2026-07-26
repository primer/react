import type {Meta, StoryObj} from '@storybook/react-vite'
import React from 'react'
import {Flash} from '../Flash'
import {Tab, TabList, TabPanel, Tabs} from './Tabs'

const meta = {
  title: 'React Tailwind/Navigation/Tabs/Features',
  component: Tabs,
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

const TabFixture = ({controlled = false}: {controlled?: boolean}) => {
  const [value, setValue] = React.useState('one')
  return controlled ? (
    <>
      <Tabs value={value} onValueChange={nextValue => setValue(nextValue)}>
        <TabList aria-label="Tabs">
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
          <Tab value="three">Three</Tab>
        </TabList>
        <TabPanel value="one">Panel one</TabPanel>
        <TabPanel value="two">Panel two</TabPanel>
        <TabPanel value="three">Panel three</TabPanel>
      </Tabs>
      <button type="button" onClick={() => setValue('three')}>
        Activate panel three
      </button>
    </>
  ) : (
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

export const Uncontrolled: Story = {render: () => <TabFixture />}
export const Controlled: Story = {render: () => <TabFixture controlled />}
export const Vertical: Story = {
  render: () => (
    <>
      <Flash className="mb-4">
        This example shows the `Tabs` component with `aria-orientation` set to `vertical`, which changes the keyboard
        navigation to Up/Down arrows.
      </Flash>
      <div className="grid grid-cols-[auto_1fr]">
        <Tabs className="contents" defaultValue="one" orientation="vertical">
          <TabList aria-label="Tabs" className="flex flex-col">
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
  ),
}
