import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import CounterLabel from './CounterLabel'

export default {
  title: 'Components/CounterLabel',
  component: CounterLabel,
} as ComponentMeta<typeof CounterLabel>
export const Default: ComponentStory<typeof CounterLabel> = () => <CounterLabel>12</CounterLabel>
