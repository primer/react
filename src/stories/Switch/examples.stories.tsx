import React from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, ToggleSwitch, Text, ThemeProvider} from '../../'
import {ComponentProps} from '../../utils/types'
import {action} from '@storybook/addon-actions'

type Args = ComponentProps<typeof ToggleSwitch>

const excludedControlKeys = [
  'aria-describedby',
  'aria-labelledby',
  'defaultChecked',
  'onChange',
  'onClick',
  'statusLabelPosition',
  'sx'
]

export default {
  title: 'ToggleSwitch/examples',
  component: ToggleSwitch,
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
    loading: {
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
  parameters: {controls: {exclude: excludedControlKeys}},
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

export const Default = (args: Args) => (
  <Box display="flex">
    <Box flexGrow={1} fontSize={2} fontWeight="bold" id="switchLabel">
      Notifications
    </Box>
    <ToggleSwitch {...args} aria-labelledby="switchLabel" />
  </Box>
)
Default.storyName = 'Default (uncontrolled)'

export const Controlled = (args: Args) => {
  const [isOn, setIsOn] = React.useState(false)

  const onClick = React.useCallback(() => {
    setIsOn(!isOn)
  }, [setIsOn, isOn])

  const handleSwitchChange = (on: boolean) => {
    action(`new switch "on" state: ${on}`)
  }

  return (
    <>
      <Box display="flex" maxWidth="300px">
        <Box flexGrow={1} fontSize={2} fontWeight="bold" id="switchLabel">
          Notifications
        </Box>
        <ToggleSwitch
          onClick={onClick}
          onChange={handleSwitchChange}
          checked={isOn}
          {...args}
          aria-labelledby="switchLabel"
        />
      </Box>
      <p>The switch is {isOn ? 'on' : 'off'}</p>
    </>
  )
}
Controlled.parameters = {controls: {exclude: [...excludedControlKeys, 'on']}}

export const StatusLabelPositionedAtEnd = (args: Args) => (
  <>
    <Text fontSize={2} fontWeight="bold" id="switchLabel" display="block" mb={1}>
      Notifications
    </Text>
    <ToggleSwitch statusLabelPosition="end" {...args} aria-labelledby="switchLabel" />
  </>
)
StatusLabelPositionedAtEnd.storyName = 'statusLabelPosition="end"'
