import React from 'react'
import {Meta, ComponentStory} from '@storybook/react'
import {ComponentProps} from '../utils/types'
import {Box, Text} from '../'
import ToggleSwitch from './ToggleSwitch'

export default {
  title: 'Components/ToggleSwitch',
  component: ToggleSwitch,
} as Meta<ComponentProps<typeof ToggleSwitch>>

export const Playground: ComponentStory<typeof ToggleSwitch> = args => (
  <Box
    display="grid"
    gridTemplateColumns={'max-content auto'}
    maxWidth={'20rem'}
    alignItems={'center'}
    justifyContent={'space-between'}
  >
    <Text id="toggle" fontWeight={'bold'} fontSize={2}>
      Toggle label
    </Text>
    <ToggleSwitch {...args} aria-labelledby="toggle" />
  </Box>
)

Playground.args = {
  checked: undefined,
  disabled: false,
  loading: false,
  size: 'medium',
}
Playground.argTypes = {
  checked: {
    control: {
      type: 'boolean',
    },
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  loading: {
    control: {
      type: 'boolean',
    },
  },
  size: {
    control: {
      type: 'radio',
    },
    options: ['small', 'medium'],
  },
}

export const Default = (
  <Box
    display="grid"
    gridTemplateColumns={'max-content auto'}
    maxWidth={'20rem'}
    alignItems={'center'}
    justifyContent={'space-between'}
  >
    <Text id="toggle" fontWeight={'bold'} fontSize={2}>
      Toggle label
    </Text>
    <ToggleSwitch aria-labelledby="toggle" />
  </Box>
)
