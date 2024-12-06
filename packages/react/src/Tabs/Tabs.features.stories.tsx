import type {Meta} from '@storybook/react'
import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import getGlobalFocusStyles from '../internal/utils/getGlobalFocusStyles'
import {Tabs, TabList, Tab, TabPanel} from '../Tabs'

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

const TabPanels = styled(Tabs)``

const StyledTabList = styled(TabList)`
  margin-top: 0;
  margin-bottom: 16px;
  border-bottom: 1px solid ${get('colors.border.default')};
`

const StyledTab = styled(Tab)`
  padding: 8px 16px 9px 16px;
  font-size: ${get('fontSizes.1')};
  line-height: 23px;
  color: ${get('colors.fg.muted')};
  text-decoration: none;
  background-color: transparent;
  border: 1px solid transparent;
  border-bottom: 0;
  margin-bottom: -1px;
  cursor: pointer;

  ${getGlobalFocusStyles('-6px')};

  &:hover,
  &:focus {
    color: ${get('colors.fg.default')};
    text-decoration: none;
  }

  &:hover {
    transition-duration: 0.1s;
    transition-property: color;
  }

  &[aria-selected='true'] {
    color: ${get('colors.fg.default')};
    border-color: ${get('colors.border.default')};
    border-top-right-radius: ${get('radii.2')};
    border-top-left-radius: ${get('radii.2')};
    background-color: ${get('colors.canvas.default')};
  }
`

const StyledTabPanel = styled(TabPanel)``

export const TabPanelsStory = {
  name: 'TabPanels',
  render: () => {
    return (
      <TabPanels defaultValue="one">
        <TabList aria-label="Tabs">
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
          <Tab value="three">Three</Tab>
        </TabList>
        <TabPanel value="one">Panel one</TabPanel>
        <TabPanel value="two">Panel two</TabPanel>
        <TabPanel value="three">Panel three</TabPanel>
      </TabPanels>
    )
  },
}
