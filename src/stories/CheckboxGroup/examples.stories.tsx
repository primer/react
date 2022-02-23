import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, Checkbox, CheckboxGroup, FormControl, ThemeProvider} from '../../'
import {ComponentProps} from '../../utils/types'

type Args = ComponentProps<typeof CheckboxGroup>

export default {
  title: 'Forms/CheckboxGroup/examples',
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

export const Basic = (args: Args) => (
  <CheckboxGroup {...args}>
    <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
    <FormControl>
      <Checkbox value="one" checked />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox value="two" defaultChecked />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox value="three" />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
  </CheckboxGroup>
)

export const WithCaptionAndValidation = (args: Args) => (
  <CheckboxGroup {...args}>
    <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
    <CheckboxGroup.Caption>You can pick any or all of these choices</CheckboxGroup.Caption>
    <FormControl>
      <Checkbox value="one" />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox value="two" />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox value="three" />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
    <CheckboxGroup.Validation variant="error">Your choices are wrong</CheckboxGroup.Validation>
  </CheckboxGroup>
)
