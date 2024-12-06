import {render, screen} from '@testing-library/react'
import React from 'react'
import {Tabs, TabList, Tab, TabPanel} from '../Tabs'

describe('Tabs', () => {
  test('defaultValue', () => {
    render(
      <Tabs defaultValue="a">
        <TabList aria-label="Tabs">
          <Tab value="a">a</Tab>
          <Tab value="b">b</Tab>
          <Tab value="c">c</Tab>
        </TabList>
        <TabPanel value="a">Panel a</TabPanel>
        <TabPanel value="b">Panel b</TabPanel>
        <TabPanel value="c">Panel c</TabPanel>
      </Tabs>,
    )
  })
})
