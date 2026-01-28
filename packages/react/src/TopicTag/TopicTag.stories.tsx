import type {Meta, StoryObj} from '@storybook/react-vite'
import {TopicTag} from './TopicTag'

export default {
  title: 'Experimental/Components/TopicTag',
  component: TopicTag,
} satisfies Meta<typeof TopicTag>

export const Default = () => <TopicTag>react</TopicTag>

export const Playground: StoryObj<typeof TopicTag> = {
  render: args => <TopicTag {...args}>react</TopicTag>,
}
