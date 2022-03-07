import React from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, Switch, Text, ThemeProvider} from '../../'
import {ComponentProps} from '../../utils/types'

type Args = ComponentProps<typeof Switch>

export default {
  title: 'Switch/fixtrues',
  component: Switch,
  argTypes: {
    on: {
      defaultValue: undefined,
      control: {
        type: 'boolean'
      }
    },
    disabled: {
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    isLoading: {
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    size: {
      defaultValue: 'medium',
      control: {
        type: 'radio',
        options: ['small', 'medium']
      }
    }
  },
  parameters: {
    controls: {
      exclude: ['aria-describedby', 'aria-labelledby', 'defaultOn', 'onChange', 'onClick', 'statusLabelPosition']
    }
  },
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ]
} as Meta

export const WithCaption = (args: Args) => (
  <Box display="flex">
    <Box flexGrow={1}>
      <Text fontSize={2} fontWeight="bold" id="switchLabel" display="block">
        Notifications
      </Text>
      <Text color="fg.subtle" fontSize={1} id="switchCaption" display="block">
        Notifications will be delivered via email and the GitHub notification center
      </Text>
    </Box>
    <Switch {...args} aria-labelledby="switchLabel" aria-describedby="switchCaption" />
  </Box>
)
WithCaption.storyName = 'Associated with a caption'
