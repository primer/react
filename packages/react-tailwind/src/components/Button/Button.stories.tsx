import type {Meta, StoryObj} from '@storybook/react-vite'
import {Button} from './Button'

const meta = {
  title: 'React Tailwind/Display/Button',
  component: Button,
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {children: 'Default'}}
export const Playground: Story = {
  args: {
    alignContent: 'center',
    block: false,
    children: 'Button',
    disabled: false,
    inactive: false,
    labelWrap: false,
    loading: false,
    size: 'medium',
    variant: 'default',
  },
}
