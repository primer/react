import type {Meta, StoryObj} from '@storybook/react-vite'
import {StateLabel} from './StateLabel'

const meta = {
  title: 'React Tailwind/Display/StateLabel',
  component: StateLabel,
} satisfies Meta<typeof StateLabel>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {status: 'issueOpened', children: 'Open'}}
export const Playground: Story = {args: {status: 'pullMerged', children: 'Merged', size: 'small'}}
