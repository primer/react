import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import CounterLabel from './CounterLabel'

export default {
  title: 'Components/CounterLabel/Features',
  component: CounterLabel,
} as ComponentMeta<typeof CounterLabel>

export const PrimaryTheme: ComponentStory<typeof CounterLabel> = () => <CounterLabel scheme="primary">12</CounterLabel>
