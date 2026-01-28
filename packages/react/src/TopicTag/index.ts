import {TopicTag as TopicTagImpl} from './TopicTag'
import type {TopicTagProps} from './TopicTag'
import {TopicTagGroup} from './TopicTagGroup'
import type {TopicTagGroupProps} from './TopicTagGroup'

const TopicTag = Object.assign(TopicTagImpl, {
  Group: TopicTagGroup,
})

export {TopicTag}
export type {TopicTagProps, TopicTagGroupProps}
