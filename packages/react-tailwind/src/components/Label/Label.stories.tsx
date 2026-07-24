import type {Meta, StoryObj} from '@storybook/react-vite'
import {Label} from './Label'

const meta = {
  title: 'React Tailwind/Display/Label',
  component: Label,
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {children: 'Default'}}
export const Playground: Story = {args: {children: 'Label', variant: 'default', size: 'small'}}
