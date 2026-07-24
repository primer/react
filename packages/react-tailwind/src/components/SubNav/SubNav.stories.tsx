import type {Meta, StoryObj} from '@storybook/react-vite'
import {SubNav} from './SubNav'

const meta = {
  title: 'React Tailwind/Navigation/SubNav',
  component: SubNav,
  render: args => (
    <SubNav {...args} label="Repository">
      <SubNav.Links>
        <SubNav.Link href="/" selected>
          Code
        </SubNav.Link>
        <SubNav.Link href="/issues">Issues</SubNav.Link>
      </SubNav.Links>
    </SubNav>
  ),
} satisfies Meta<typeof SubNav>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {args: {actions: <button type="button">New issue</button>}}
export const WithActions: Story = {args: {actions: <button type="button">New issue</button>}}
