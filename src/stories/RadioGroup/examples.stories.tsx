import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, Radio, RadioGroup, FormControl, ThemeProvider} from '../../'
import {ComponentProps} from '../../utils/types'

type Args = ComponentProps<typeof RadioGroup>

export default {
  title: 'Forms/RadioGroup/examples',
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

export const Basic = ({name: _name, ...args}: Args) => (
  <RadioGroup name="basicGroup" {...args}>
    <RadioGroup.Label>Choices</RadioGroup.Label>
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

export const WithCaptionAndValidation = ({name: _name, ...args}: Args) => (
  <RadioGroup name="captionedGroup" {...args}>
    <RadioGroup.Label>Choices</RadioGroup.Label>
    <RadioGroup.Caption>You can pick any or all of these choices</RadioGroup.Caption>
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
    <RadioGroup.Validation variant="error">Your choices are wrong</RadioGroup.Validation>
  </RadioGroup>
)
