import React from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, ToggleSwitch, Text, ThemeProvider} from '../../'
import {ComponentProps} from '../../utils/types'

type Args = ComponentProps<typeof ToggleSwitch>

export default {
  title: 'Components/ToggleSwitch/fixtures',
  component: ToggleSwitch,
  args: {
    on: undefined,
    disabled: false,
    loading: false
  },
  argTypes: {
    on: {
      control: {
        type: 'boolean'
      }
    },
    disabled: {
      control: {
        type: 'boolean'
      }
    },
    loading: {
      control: {
        type: 'boolean'
      }
    },
    size: {
      control: {
        type: 'radio'
      },
      options: ['small', 'medium']
    }
  },
  parameters: {
    controls: {
      exclude: ['aria-describedby', 'aria-labelledby', 'defaultChecked', 'onChange', 'onClick', 'statusLabelPosition']
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

export const Small = (args: Args) => (
  <>
    <Box fontSize={1} fontWeight="bold" id="switchLabel">
      Notifications
    </Box>
    <ToggleSwitch {...args} aria-labelledby="switchLabel" size="small" />
  </>
)

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
    <ToggleSwitch {...args} aria-labelledby="switchLabel" aria-describedby="switchCaption" />
  </Box>
)
WithCaption.storyName = 'Associated with a caption'
