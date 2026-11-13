import {CodeIcon, GitPullRequestIcon, PeopleIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import type {ComponentProps} from 'react'
import {UnderlineNav} from './UnderlineNav'

const icons = {CodeIcon, GitPullRequestIcon, PeopleIcon}
type ItemStoryArgs = Omit<ComponentProps<typeof UnderlineNav.Item>, 'leadingVisual'> & {icon?: keyof typeof icons}

const meta = {
  title: 'React Tailwind/Navigation/UnderlineNav.Item',
  component: UnderlineNav.Item,
  decorators: [
    Story => (
      <UnderlineNav aria-label="Repository">
        <Story />
      </UnderlineNav>
    ),
  ],
  parameters: {controls: {expanded: true, exclude: ['as']}},
  args: {children: 'Code', counter: '12K', icon: 'PeopleIcon'},
  argTypes: {
    children: {control: 'text'},
    counter: {control: 'text'},
    icon: {control: 'select', options: Object.keys(icons)},
  },
} satisfies Meta<ItemStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: ({icon, ...args}) => {
    const Icon = icon ? icons[icon] : undefined
    return <UnderlineNav.Item aria-current="page" {...args} leadingVisual={Icon ? <Icon /> : undefined} />
  },
}
