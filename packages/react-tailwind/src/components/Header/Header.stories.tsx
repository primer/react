import type {Meta, StoryObj} from '@storybook/react-vite'
import {Header} from './Header'

const meta = {
  title: 'Layout/Header',
  component: Header,
  render: args => (
    <Header {...args}>
      <Header.Link href="/">GitHub</Header.Link>
      <Header.Item full>Search</Header.Item>
      <Header.Item>Profile</Header.Item>
    </Header>
  ),
} satisfies Meta<typeof Header>
export default meta
export const Default: StoryObj<typeof meta> = {}
export const Playground: StoryObj<typeof meta> = {args: {as: 'div'}}
export const Items: StoryObj<typeof meta> = {}
