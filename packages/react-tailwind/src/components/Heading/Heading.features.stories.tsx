import type {Meta, StoryObj} from '@storybook/react-vite'
import {Heading} from './Heading'

const meta = {title: 'React Tailwind/Display/Heading/Features', component: Heading} satisfies Meta<typeof Heading>
export default meta
type Story = StoryObj<typeof meta>

export const Small: Story = {args: {size: 'small', children: 'Small heading'}}
export const Medium: Story = {args: {size: 'medium', children: 'Medium heading'}}
export const Large: Story = {args: {size: 'large', children: 'Large heading'}}
