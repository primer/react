import type {Meta, StoryObj} from '@storybook/react-vite'
import {ButtonBase} from './index'

const meta = {
  title: 'React Tailwind/Display/ButtonBase',
  component: ButtonBase,
  args: {children: 'Base button', type: 'button'},
} satisfies Meta<typeof ButtonBase>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Playground: Story = {}
