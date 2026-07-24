import type {Meta, StoryObj} from '@storybook/react-vite'
import {TopicTag} from './TopicTag'
const meta = {title: 'Content/TopicTag', component: TopicTag, args: {children: 'react', href: '#react'}} satisfies Meta<
  typeof TopicTag
>
export default meta
export const Default: StoryObj<typeof meta> = {}
export const Playground: StoryObj<typeof meta> = {args: {as: 'button'}}
