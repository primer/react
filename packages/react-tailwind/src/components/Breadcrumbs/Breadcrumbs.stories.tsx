import type {Meta, StoryObj} from '@storybook/react-vite'
import {Breadcrumbs} from './Breadcrumbs'

const meta = {
  title: 'React Tailwind/Navigation/Breadcrumbs',
  component: Breadcrumbs,
  render: args => (
    <Breadcrumbs {...args}>
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/settings">Settings</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/settings/profile" selected>
        Profile
      </Breadcrumbs.Item>
    </Breadcrumbs>
  ),
} satisfies Meta<typeof Breadcrumbs>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {args: {variant: 'spacious'}}
export const OverflowMenu: Story = {args: {overflow: 'menu'}}
