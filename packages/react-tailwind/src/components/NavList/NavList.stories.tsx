import type {Meta, StoryObj} from '@storybook/react-vite'
import {NavList} from './NavList'
const meta = {
  title: 'React Tailwind/Navigation/NavList',
  component: NavList,
} satisfies Meta<typeof NavList>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <NavList aria-labelledby="repo-nav">
      <NavList.Heading id="repo-nav">Repository</NavList.Heading>
      <NavList.List>
        <NavList.Item href="#" aria-current="page">
          Overview
        </NavList.Item>
        <NavList.Item href="#">Settings</NavList.Item>
      </NavList.List>
    </NavList>
  ),
}
