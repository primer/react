import type {Meta, StoryObj} from '@storybook/react-vite'
import {RefPickerV1} from './RefPickerV1'
import {branches, tags} from './refPickerMockData'

const meta = {
  title: 'Components/SelectPanel/Examples/RefPickerV1',
  component: RefPickerV1,
} satisfies Meta<typeof RefPickerV1>

export default meta

type Story = StoryObj<typeof RefPickerV1>

export const Default: Story = {
  args: {
    branches,
    tags,
    initialSelection: {type: 'branches', name: 'main'},
  },
}

export const StartOnTags: Story = {
  args: {
    branches,
    tags,
    initialTab: 'tags',
    initialSelection: {type: 'tags', name: 'v2.0.0'},
  },
}

export const NoInitialSelection: Story = {
  args: {
    branches,
    tags,
  },
}
