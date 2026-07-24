import type {Meta, StoryObj} from '@storybook/react-vite'
import {SubNav} from './SubNav'

const meta = {
  title: 'React Tailwind/Navigation/SubNav',
  component: SubNav,
  render: args => (
    <SubNav {...args} aria-label="Main">
      <SubNav.Links>
        <SubNav.Link href="#home" selected>
          Home
        </SubNav.Link>
        <SubNav.Link href="#documentation">Documentation</SubNav.Link>
        <SubNav.Link href="#support">Support</SubNav.Link>
      </SubNav.Links>
    </SubNav>
  ),
} satisfies Meta<typeof SubNav>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {args: {'aria-label': 'Main'}}
export const WithActions: Story = {args: {actions: <button type="button">New issue</button>}}
