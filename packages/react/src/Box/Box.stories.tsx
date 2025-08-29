import type {Meta, StoryFn} from '@storybook/react-vite'
import Box from './Box'
import {clsx} from 'clsx'
import classes from './Box.stories.module.css'

export default {
  title: 'Deprecated/Components/Box',
  component: Box,
} as Meta<typeof Box>

export const Default = () => <div>Default Box</div>

export const Playground: StoryFn<typeof Box> = args => {
  const as = args.as || 'div'
  const Element = as as keyof JSX.IntrinsicElements
  return <Element className={clsx(classes.PlaygroundBox)}>Playground</Element>
}

Playground.args = {
  as: 'div',
}

Playground.argTypes = {
  forwardedAs: {
    controls: false,
    table: {
      disable: true,
    },
  },
  ref: {
    controls: false,
    table: {
      disable: true,
    },
  },
  theme: {
    controls: false,
    table: {
      disable: true,
    },
  },
}
