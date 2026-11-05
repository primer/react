import type {Meta, StoryObj} from '@storybook/react-vite'
import {UnderlineNav} from './UnderlineNav'
const meta = {
  title: 'React Tailwind/Navigation/UnderlineNav',
  component: UnderlineNav,
  args: {'aria-label': 'Repository', hideIconsBreakpoint: 'medium', loadingCounters: false, variant: 'inset'},
  argTypes: {
    'aria-label': {control: 'text'},
    hideIconsBreakpoint: {
      control: 'select',
      options: ['xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge', null],
    },
    loadingCounters: {control: 'boolean'},
    variant: {control: 'radio', options: ['inset', 'flush']},
  },
  parameters: {controls: {include: ['aria-label', 'hideIconsBreakpoint', 'loadingCounters', 'variant']}},
} satisfies Meta<typeof UnderlineNav>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <UnderlineNav aria-label="Repository">
      {['Code', 'Pull requests', 'Actions', 'Projects', 'Wiki'].map((item, index) => (
        <UnderlineNav.Item key={item} href="#" aria-current={index === 0 ? 'page' : undefined}>
          {item}
        </UnderlineNav.Item>
      ))}
    </UnderlineNav>
  ),
}
export const Playground: Story = {
  render: args => (
    <UnderlineNav {...args}>
      {['Code', 'Pull requests', 'Actions', 'Projects', 'Wiki'].map((item, index) => (
        <UnderlineNav.Item key={item} href="#" aria-current={index === 0 ? 'page' : undefined}>
          {item}
        </UnderlineNav.Item>
      ))}
    </UnderlineNav>
  ),
}
