import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import CircleOcticon from './CircleOcticon'
import type {CircleOcticonProps} from './CircleOcticon'
import {CheckIcon} from '@primer/octicons-react'
// eslint-disable-next-line import/no-namespace
import * as Icons from '@primer/octicons-react'

const meta: Meta<typeof CircleOcticon> = {
  title: 'Components/CircleOcticon',
  component: CircleOcticon,
}
export default meta

export const Default = () => (
  <CircleOcticon icon={CheckIcon} size={32} sx={{backgroundColor: 'success.emphasis', color: 'fg.onEmphasis'}} />
)

type PlaygroundTypes = Omit<CircleOcticonProps, 'icon'> & {icon: keyof typeof Icons}
export const Playground: StoryFn<PlaygroundTypes> = ({icon: iconName, ...args}) => (
  <CircleOcticon icon={Icons[iconName]} {...args} />
)

Playground.args = {
  size: 32,
  icon: 'CheckIcon',
  sx: {backgroundColor: 'success.emphasis', color: 'fg.onEmphasis'},
}

Playground.argTypes = {
  size: {
    controls: {
      type: 'number',
    },
  },
  icon: {
    control: {
      type: 'select',
    },
    options: Object.keys(Icons),
  },
  sx: {
    controls: false,
  },
}
