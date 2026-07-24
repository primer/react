import type {Meta, StoryObj} from '@storybook/react-vite'
import {Banner} from './Banner'
const meta = {
  title: 'React Tailwind/Content/Banner',
  component: Banner,
  args: {title: 'Important update', children: 'This is additional context.'},
} satisfies Meta<typeof Banner>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {args: {variant: 'warning', layout: 'compact', onDismiss: () => {}}}
