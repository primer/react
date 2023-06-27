import React from 'react'
import {Meta, ComponentStory} from '@storybook/react'
import StyledOcticon from './StyledOcticon'
import {HeartFillIcon} from '@primer/octicons-react'

export default {
  title: 'Components/StyledOcticon',
  component: StyledOcticon,
} as Meta<typeof StyledOcticon>

export const Default = () => <StyledOcticon icon={HeartFillIcon} size={32} />

export const Playground: ComponentStory<typeof StyledOcticon> = args => <StyledOcticon icon={HeartFillIcon} {...args} />

Playground.args = {
  ariaLabel: 'Heart',
  size: 32,
}

Playground.argTypes = {
  size: {
    control: {
      type: 'number',
    },
  },
  verticalAlign: {
    type: 'string',
  },
  icon: {
    controls: false,
    table: {
      disable: true,
    },
  },
  sx: {
    controls: false,
    table: {
      disable: true,
    },
  },
  as: {
    controls: false,
    table: {
      disable: true,
    },
  },
  forwardedAs: {
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
