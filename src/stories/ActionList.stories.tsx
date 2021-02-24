import {Meta} from '@storybook/react'
import React from 'react'
import {ActionList} from '../ActionList'
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
