import type {StoryFn, Meta} from '@storybook/react-vite'
import CounterLabel from './CounterLabel'

export default {
  title: 'Components/CounterLabel/Features',
  component: CounterLabel,
} as Meta<typeof CounterLabel>

export const PrimaryTheme: StoryFn<typeof CounterLabel> = () => <CounterLabel scheme="primary">12</CounterLabel>

export const SecondaryTheme: StoryFn<typeof CounterLabel> = () => <CounterLabel scheme="secondary">12</CounterLabel>
