import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, Box, Checkbox, FormControl, ThemeProvider} from '../../'
import ChoiceGroup from '../../ChoiceGroup'
import {ComponentProps} from '../../utils/types'

type Args = ComponentProps<typeof ChoiceGroup>

export default {
  title: 'Forms/ChoiceGroup/fixtures',
  component: ChoiceGroup,
  argTypes: {
    disabled: {
      defaultValue: false
    },
    required: {
      defaultValue: false
    }
  },
  parameters: {controls: {exclude: ['id', 'validationMap', 'validationResult', 'name', 'onSelect']}},
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
    <ChoiceGroup aria-labelledby="choiceHeading" {...args}>
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
    </ChoiceGroup>
  </>
)

export const WithHiddenLabel = (args: Args) => (
  <ChoiceGroup {...args}>
    <ChoiceGroup.Label visuallyHidden>Choices</ChoiceGroup.Label>
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
  </ChoiceGroup>
)
