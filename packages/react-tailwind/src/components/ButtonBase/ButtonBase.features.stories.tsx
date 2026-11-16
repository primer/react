import type {Meta, StoryObj} from '@storybook/react-vite'
import {ButtonBase} from './index'

const meta = {
  title: 'React Tailwind/Display/ButtonBase/Features',
  component: ButtonBase,
  args: {children: 'Base button', type: 'button'},
} satisfies Meta<typeof ButtonBase>

export default meta
type Story = StoryObj<typeof meta>

export const Disabled: Story = {args: {children: 'Unavailable', disabled: true}}
export const WithCustomClassName: Story = {args: {children: 'Custom spacing', className: 'px-4 py-2'}}
