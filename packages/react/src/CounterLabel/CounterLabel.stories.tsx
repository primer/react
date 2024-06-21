import React from 'react'
import type {StoryFn, Meta} from '@storybook/react'
import CounterLabel from './CounterLabel'

export default {
  title: 'Components/CounterLabel',
  component: CounterLabel,
} as Meta<typeof CounterLabel>
export const Default: StoryFn<typeof CounterLabel> = () => <CounterLabel>12</CounterLabel>
