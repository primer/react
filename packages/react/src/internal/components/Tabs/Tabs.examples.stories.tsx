import type {Meta} from '@storybook/react-vite'
import {action} from 'storybook/actions'
import React from 'react'
import {Tabs, TabPanel, useTabList, useTab} from '.'
import {ActionList} from '../../../ActionList'

const meta = {
  title: 'Private/Components/Tabs/Examples',
  component: Tabs,
} satisfies Meta<typeof Tabs>

export default meta

const CustomTabList = (props: React.PropsWithChildren) => {
  const tabListProps = useTabList<HTMLUListElement>({'aria-label': 'Tabs', 'aria-orientation': 'vertical'})

  return (
    <div style={{width: '200px'}}>
      <ActionList {...tabListProps}>{props.children}</ActionList>
    </div>
  )
}

const CustomTab = (props: React.PropsWithChildren<{value: string}>) => {
  const tabProps = useTab({value: props.value})

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
      <p>
        This example shows how to use the `Tabs` component with custom Components for the TabList and Tabs. Here we are
        using `ActionList` and `ActionList.Item`
      </p>
      <p>
        The direction is also set to `vertical` to demonstrate the `aria-orientation` prop handling. Which also changes
        the keyboard navigation to Up/Down arrows.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
        }}
      >
        <Tabs
          defaultValue="one"
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
          </CustomTabList>
          <TabPanel value="one">Panel one</TabPanel>
          <TabPanel value="two">Panel two</TabPanel>
          <TabPanel value="three">Panel three</TabPanel>
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
