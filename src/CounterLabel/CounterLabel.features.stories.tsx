import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import CounterLabel from './CounterLabel'

const meta: ComponentMeta<typeof CounterLabel> = {
  title: 'Components/CounterLabel/Features',
  component: CounterLabel,
}

export default meta
// eslint-disable-next-line storybook/prefer-pascal-case
export const primaryTheme: ComponentStory<typeof CounterLabel> = () => <CounterLabel scheme="primary">12</CounterLabel>
