import {Meta} from '@storybook/react'
import React from 'react'
import {ActionList, ActionListSectionHeader} from '../ActionList'
import BaseStyles from '../BaseStyles'

const meta: Meta = {
  title: 'Composite components/ActionList',
  component: ActionList,
  decorators: [
    (Story: React.ComponentType): JSX.Element => (
      <BaseStyles>
        <Story />
      </BaseStyles>
    )
  ]
}
export default meta

export function ActionListStory(): JSX.Element {
  return <ActionList>Hello, world!</ActionList>
}

export function ActionListSectionHeaderStory(): JSX.Element {
  return (
    <>
      <h1>ActionListSectionHeader</h1>
      <h2>Filled Variant</h2>
      <ActionListSectionHeader title="A very cool section" variant="filled" />
      <h2>Subtle Variant</h2>
      <ActionListSectionHeader title="A very cool section" variant="subtle" />
    </>
  )
}
