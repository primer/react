import type {Meta, StoryObj} from '@storybook/react-vite'
import {UnderlineNav} from './UnderlineNav'
const meta = {
  title: 'React Tailwind/Navigation/UnderlineNav',
  component: UnderlineNav,
} satisfies Meta<typeof UnderlineNav>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <UnderlineNav aria-label="Repository">
      <UnderlineNav.List>
        <UnderlineNav.Item href="#" aria-current="page">
          Code
        </UnderlineNav.Item>
        <UnderlineNav.Item href="#" counter={12}>
          Issues
        </UnderlineNav.Item>
      </UnderlineNav.List>
    </UnderlineNav>
  ),
}
