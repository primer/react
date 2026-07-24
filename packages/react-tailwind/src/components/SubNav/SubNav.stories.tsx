import type {Meta, StoryObj} from '@storybook/react-vite'
import {SubNav} from './SubNav'

const meta = {
  title: 'Navigation/SubNav',
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
export const Default: StoryObj<typeof meta> = {}
export const Playground: StoryObj<typeof meta> = {args: {actions: <button type="button">New issue</button>}}
export const WithActions: StoryObj<typeof meta> = {args: {actions: <button type="button">New issue</button>}}
