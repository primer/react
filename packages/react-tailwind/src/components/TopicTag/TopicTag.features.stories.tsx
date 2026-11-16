import type {Meta, StoryObj} from '@storybook/react-vite'
import {TopicTag, TopicTagGroup} from './TopicTag'

const meta = {
  title: 'React Tailwind/Content/TopicTag/Features',
  component: TopicTag,
  args: {children: 'react'},
} satisfies Meta<typeof TopicTag>

export default meta
type Story = StoryObj<typeof meta>

export const AsButton: Story = {
  args: {as: 'button'},
}

export const AsGroup: Story = {
  render: () => {
    const tags = [
      'react',
      'nodejs',
      'javascript',
      'd3',
      'teachers',
      'community',
      'education',
      'programming',
      'curriculum',
      'math',
    ]
    return (
      <TopicTagGroup>
        {tags.map(tag => (
          <TopicTag key={tag} href={`/topics/${tag}`}>
            {tag}
          </TopicTag>
        ))}
      </TopicTagGroup>
    )
  },
}

export const AsLink: Story = {args: {href: '/topics/react'}}

export const LongTopic: Story = {
  args: {children: 'a-topic-with-a-long-name', href: '/topics/a-topic-with-a-long-name'},
}
