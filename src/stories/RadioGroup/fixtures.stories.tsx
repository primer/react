import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, Box, Radio, RadioGroup, FormControl, ThemeProvider} from '../../'
import {ComponentProps} from '../../utils/types'

type Args = ComponentProps<typeof RadioGroup>

export default {
  title: 'Forms/RadioGroup/fixtures',
  component: RadioGroup,
  argTypes: {
    disabled: {
      defaultValue: false
    },
    required: {
      defaultValue: false
    }
  },
  parameters: {controls: {exclude: ['aria-labelledby', 'id', 'name', 'onChange', 'sx']}},
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

export const WithExternalLabel = ({name: _name, ...args}: Args) => (
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
    <RadioGroup aria-labelledby="choiceHeading" name="externallyLabelledGroup" {...args}>
      <FormControl>
        <Radio value="choiceOne" />
        <FormControl.Label>Choice one</FormControl.Label>
      </FormControl>
      <FormControl>
        <Radio value="choiceTwo" />
        <FormControl.Label>Choice two</FormControl.Label>
      </FormControl>
      <FormControl>
        <Radio value="choiceThree" />
        <FormControl.Label>Choice three</FormControl.Label>
      </FormControl>
    </RadioGroup>
  </>
)

export const WithHiddenLabel = ({name: _name, ...args}: Args) => (
  <RadioGroup name="hiddenLabelGroup" {...args}>
    <RadioGroup.Label visuallyHidden>Choices</RadioGroup.Label>
    <FormControl>
      <Radio value="choiceOne" />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio value="choiceTwo" />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio value="choiceThree" />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
  </RadioGroup>
)
