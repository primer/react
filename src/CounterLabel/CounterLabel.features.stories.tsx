import {ComponentMeta, ComponentStory} from '@storybook/react'
import React from 'react'
import CounterLabel from './CounterLabel'

export default {
  title: 'Components/CounterLabel/Features',
  component: CounterLabel,
} as ComponentMeta<typeof CounterLabel>

export const PrimaryTheme: ComponentStory<typeof CounterLabel> = () => <CounterLabel scheme="primary">12</CounterLabel>
