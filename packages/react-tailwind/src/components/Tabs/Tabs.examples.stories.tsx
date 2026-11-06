import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import React from 'react'
import {actionItemClassName, getActionItemStateClassName} from '../ActionList/itemState'
import {cn} from '../../internal/cn'
import {StoryNotice} from '../../internal/StoryNotice.storyHelpers'
import {Tab, TabList, TabPanel, Tabs} from './index'

const meta = {
  title: 'React Tailwind/Navigation/Tabs/Examples',
  component: Tabs,
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const WithCustomComponents: Story = {
  render: () => {
    const [value, setValue] = React.useState('one')
    return (
      <>
        <StoryNotice className="mb-4">
          This example shows how to use the `Tabs` component with custom Components for the TabList and Tabs. Here we
          are using `ActionList` and `ActionList.Item`
          <br />
          The direction is also set to `vertical` to demonstrate the `aria-orientation` prop handling. Which also
          changes the keyboard navigation to Up/Down arrows.
        </StoryNotice>
        <div className="grid grid-cols-[auto_1fr]">
          <Tabs className="contents" value={value} orientation="vertical" onValueChange={next => setValue(next)}>
            <TabList aria-label="Tabs" className="flex w-[200px] flex-col py-2">
              {[
                ['one', 'One'],
                ['two', 'Two'],
                ['three', 'Three'],
                ['four', 'Four'],
              ].map(([tabValue, label]) => (
                <Tab
                  key={tabValue}
                  value={tabValue}
                  disabled={tabValue === 'four'}
                  className={state =>
                    cn(
                      actionItemClassName,
                      'relative mx-2 data-[active]:font-semibold',
                      getActionItemStateClassName({active: state.active, disabled: state.disabled}),
                    )
                  }
                >
                  {label}
                </Tab>
              ))}
            </TabList>
            <TabPanel value="one">Panel one</TabPanel>
            <TabPanel value="two">Panel two</TabPanel>
            <TabPanel value="three">Panel three</TabPanel>
            <TabPanel value="four">Panel four</TabPanel>
          </Tabs>
        </div>
        <button type="button" onClick={() => setValue('three')}>
          Activate panel three
        </button>
      </>
    )
  },
}

export const KeyboardInteraction: Story = {
  render: () => (
    <Tabs defaultValue="one">
      <TabList aria-label="Keyboard interaction">
        <Tab value="one">One</Tab>
        <Tab value="two">Two</Tab>
      </TabList>
      <TabPanel value="one">Panel one</TabPanel>
      <TabPanel value="two">Panel two</TabPanel>
    </Tabs>
  ),
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    canvas.getByRole('tab', {name: 'One'}).focus()
    await userEvent.keyboard('{ArrowRight}')
    const panel = canvas.getByText('Panel two').closest('[role="tabpanel"]')
    await expect(panel).not.toBeNull()
    await expect(panel).toBeVisible()
  },
}
