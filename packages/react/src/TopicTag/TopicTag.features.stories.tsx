import type {Meta} from '@storybook/react-vite'
import {TopicTag} from './TopicTag'
import {TopicTagGroup} from './TopicTagGroup'

export default {
  title: 'Experimental/Components/TopicTag/Features',
  component: TopicTag,
} satisfies Meta<typeof TopicTag>

export const AsButton = () => <TopicTag as="button">react</TopicTag>

export const AsGroup = () => {
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
}
