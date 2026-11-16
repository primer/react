import type {Meta, StoryObj} from '@storybook/react-vite'
import {TopicTag, TopicTagGroup} from './TopicTag'

const meta = {
  title: 'React Tailwind/Content/TopicTag/Examples',
  component: TopicTag,
} satisfies Meta<typeof TopicTag>

export default meta
type Story = StoryObj<typeof meta>

export const RepositoryTopics: Story = {
  render: () => (
    <TopicTagGroup aria-label="Repository topics">
      {['react', 'design-system', 'typescript', 'accessibility'].map(tag => (
        <TopicTag key={tag} href={`/topics/${tag}`}>
          {tag}
        </TopicTag>
      ))}
    </TopicTagGroup>
  ),
}

export const SelectableTopics: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <TopicTag as="button">frontend</TopicTag>
      <TopicTag as="button">tailwind</TopicTag>
      <TopicTag as="button">storybook</TopicTag>
    </div>
  ),
}

export const WrappedTopics: Story = {
  render: () => (
    <div className="max-w-xs">
      <TopicTagGroup>
        {['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'].map(tag => (
          <TopicTag key={tag}>{tag}</TopicTag>
        ))}
      </TopicTagGroup>
    </div>
  ),
}
