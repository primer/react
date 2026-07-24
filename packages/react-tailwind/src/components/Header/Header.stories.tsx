import type {Meta, StoryObj} from '@storybook/react-vite'
import {Header} from './Header'

const meta = {
  title: 'React Tailwind/Layout/Header',
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

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {args: {as: 'div'}}
export const Items: Story = {}
