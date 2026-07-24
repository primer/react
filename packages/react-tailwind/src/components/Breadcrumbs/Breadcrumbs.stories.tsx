import type {Meta, StoryObj} from '@storybook/react-vite'
import {Breadcrumbs} from './Breadcrumbs'

const meta = {
  title: 'Navigation/Breadcrumbs',
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
export const Default: StoryObj<typeof meta> = {}
export const Playground: StoryObj<typeof meta> = {args: {variant: 'spacious'}}
export const OverflowMenu: StoryObj<typeof meta> = {args: {overflow: 'menu'}}
