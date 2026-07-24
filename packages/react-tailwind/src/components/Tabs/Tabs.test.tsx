import {cleanup, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {afterEach, describe, expect, it} from 'vitest'
import {Tab, TabList, TabPanel, Tabs} from './Tabs'
import {useTab} from './useTab'
import {useTabList} from './useTabList'
import {useTabPanel} from './useTabPanel'

afterEach(cleanup)

describe('Tabs', () => {
  it('uses Base UI tab semantics, links panels, and supports arrow-key selection', async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="one">
        <TabList aria-label="Views">
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
        </TabList>
        <TabPanel value="one">First panel</TabPanel>
        <TabPanel value="two">Second panel</TabPanel>
      </Tabs>,
    )
    const one = screen.getByRole('tab', {name: 'One'})
    await user.click(one)
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', {name: 'Two'})).toHaveFocus()
    expect(screen.getByRole('tab', {name: 'Two'})).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Second panel')).toBeVisible()
  })

  it('lets hooks compose the shared Base UI tabs model', async () => {
    const user = userEvent.setup()
    function CustomTabs() {
      const {tabListProps} = useTabList({'aria-label': 'Custom views'})
      const {tabProps: firstTabProps} = useTab({value: 'first'})
      const {tabProps: secondTabProps} = useTab({value: 'second'})
      const {tabPanelProps: firstPanelProps} = useTabPanel({value: 'first'})
      const {tabPanelProps: secondPanelProps} = useTabPanel({value: 'second'})

      return (
        <Tabs defaultValue="first">
          <TabList {...tabListProps}>
            <Tab {...firstTabProps}>First</Tab>
            <Tab {...secondTabProps}>Second</Tab>
          </TabList>
          <TabPanel {...firstPanelProps}>First panel</TabPanel>
          <TabPanel {...secondPanelProps}>Second panel</TabPanel>
        </Tabs>
      )
    }

    render(<CustomTabs />)
    await user.click(screen.getByRole('tab', {name: 'First'}))
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', {name: 'Second'})).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Second panel')
  })
})
