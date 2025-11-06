import type {Meta} from '@storybook/react-vite'
import {action} from 'storybook/actions'
import React from 'react'
import {Tabs, TabPanel, useTabList, useTab} from './Tabs'
import {ActionList} from '../../ActionList'
import Flash from '../../Flash'

const meta = {
  title: 'Experimental/Components/Tabs/Examples',
  component: Tabs,
} satisfies Meta<typeof Tabs>

export default meta

const CustomTabList = (props: React.PropsWithChildren) => {
  const {tabListProps} = useTabList<HTMLUListElement>({'aria-label': 'Tabs', 'aria-orientation': 'vertical'})

  return (
    <div style={{width: '200px'}}>
      <ActionList {...tabListProps}>{props.children}</ActionList>
    </div>
  )
}

const CustomTab = (props: React.PropsWithChildren<{value: string; disabled?: boolean}>) => {
  const {tabProps} = useTab({value: props.value, disabled: props.disabled})

  return (
    <ActionList.Item {...tabProps} active={String(tabProps['aria-selected']) === 'true'}>
      {props.children}
    </ActionList.Item>
  )
}

export const WithCustomComponents = () => {
  const [value, setValue] = React.useState('one')
  return (
    <>
      <Flash style={{marginBottom: '16px'}}>
        This example shows how to use the `Tabs` component with custom Components for the TabList and Tabs. Here we are
        using `ActionList` and `ActionList.Item`
        <br />
        The direction is also set to `vertical` to demonstrate the `aria-orientation` prop handling. Which also changes
        the keyboard navigation to Up/Down arrows.
      </Flash>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
        }}
      >
        <Tabs
          value={value}
          onValueChange={({value}) => {
            action('onValueChange')({value})
            setValue(value)
          }}
        >
          <CustomTabList>
            <CustomTab value="one">One</CustomTab>
            <CustomTab value="two">Two</CustomTab>
            <CustomTab value="three">Three</CustomTab>
            <CustomTab disabled value="four">
              Four
            </CustomTab>
          </CustomTabList>
          <TabPanel value="one">Panel one</TabPanel>
          <TabPanel value="two">Panel two</TabPanel>
          <TabPanel value="three">Panel three</TabPanel>
          <TabPanel value="four">Panel four</TabPanel>
        </Tabs>
      </div>
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
