import type {Meta, StoryObj} from '@storybook/react-vite'
import {RefPickerV1Correct} from './RefPickerV1Correct'
import {branches, tags} from './RefPickerV1Correct.data'

const meta = {
  title: 'Components/SelectPanel/Examples/RefPickerV1Correct',
  component: RefPickerV1Correct,
  args: {
    branches,
    tags,
  },
} satisfies Meta<typeof RefPickerV1Correct>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithInitialSelection: Story = {
  args: {
    initialSelected: {kind: 'branches', name: 'main'},
  },
}
