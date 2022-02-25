import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, Box, Checkbox, CheckboxGroup, FormControl, ThemeProvider} from '../../'
import {ComponentProps} from '../../utils/types'

type Args = ComponentProps<typeof CheckboxGroup>

export default {
  title: 'Forms/CheckboxGroup/fixtures',
  component: CheckboxGroup,
  argTypes: {
    disabled: {
      defaultValue: false
    },
    required: {
      defaultValue: false
    }
  },
  parameters: {controls: {exclude: ['aria-labelledby', 'id', 'onChange', 'sx']}},
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

export const WithExternalLabel = (args: Args) => (
  <>
    <Box
      id="choiceHeading"
      borderBottomWidth="1px"
      borderBottomStyle="solid"
      borderBottomColor="border.default"
      pb={2}
      mb={3}
      fontSize={3}
    >
      Choices
    </Box>
    <CheckboxGroup aria-labelledby="choiceHeading" {...args}>
      <FormControl>
        <Checkbox />
        <FormControl.Label>Choice one</FormControl.Label>
      </FormControl>
      <FormControl>
        <Checkbox />
        <FormControl.Label>Choice two</FormControl.Label>
      </FormControl>
      <FormControl>
        <Checkbox />
        <FormControl.Label>Choice three</FormControl.Label>
      </FormControl>
    </CheckboxGroup>
  </>
)

export const WithHiddenLabel = (args: Args) => (
  <CheckboxGroup {...args}>
    <CheckboxGroup.Label visuallyHidden>Choices</CheckboxGroup.Label>
    <FormControl>
      <Checkbox />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
  </CheckboxGroup>
)
