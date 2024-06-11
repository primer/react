import React from 'react'
import type {StoryFn, Meta} from '@storybook/react'
import CounterLabel from './CounterLabel'

export default {
  title: 'Components/CounterLabel/Features',
  component: CounterLabel,
} as Meta<typeof CounterLabel>

export const PrimaryTheme: StoryFn<typeof CounterLabel> = () => <CounterLabel scheme="primary">12</CounterLabel>
