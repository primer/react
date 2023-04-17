import React from 'react'
import {Meta, ComponentStory} from '@storybook/react'
import {ProgressBar} from '..'

export default {
  title: 'Components/ProgressBar',
  component: ProgressBar,
} as Meta<typeof ProgressBar>

export const Default = () => <ProgressBar />

export const Playground: ComponentStory<typeof ProgressBar> = args => (
  <ProgressBar {...args} sx={args.inline ? {width: '100px'} : {}} />
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
