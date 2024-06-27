import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import {ProgressBar} from '..'

export default {
  title: 'Components/ProgressBar',
  component: ProgressBar,
} as Meta<typeof ProgressBar>

export const Default = () => <ProgressBar aria-label="Upload test.png" />

export const Playground: StoryFn<typeof ProgressBar> = args => (
  <ProgressBar {...args} sx={args.inline ? {width: '100px'} : {}} aria-label="Upload test.png" />
)

Playground.args = {
  progress: 66,
  barSize: 'default',
  inline: false,
  bg: 'success.emphasis',
}

Playground.argTypes = {
  progress: {
    control: {
      type: 'number',
    },
  },
  barSize: {
    control: {
      type: 'radio',
    },
    options: ['small', 'default', 'large'],
  },
  inline: {
    control: {
      type: 'boolean',
    },
  },
}
