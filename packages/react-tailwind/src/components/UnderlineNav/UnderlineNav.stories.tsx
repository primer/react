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
        {['Code', 'Pull requests', 'Actions', 'Projects', 'Wiki'].map((item, index) => (
          <UnderlineNav.Item key={item} href="#" aria-current={index === 0 ? 'page' : undefined}>
            {item}
          </UnderlineNav.Item>
        ))}
      </UnderlineNav.List>
    </UnderlineNav>
  ),
}
export const Playground: Story = {
  render: args => (
    <UnderlineNav {...args} aria-label="Repository">
      <UnderlineNav.List>
        {['Code', 'Pull requests', 'Actions', 'Projects', 'Wiki'].map((item, index) => (
          <UnderlineNav.Item key={item} href="#" aria-current={index === 0 ? 'page' : undefined}>
            {item}
          </UnderlineNav.Item>
        ))}
      </UnderlineNav.List>
    </UnderlineNav>
  ),
}
