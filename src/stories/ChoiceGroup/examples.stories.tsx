import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, Checkbox, FormControl, Radio, ThemeProvider} from '../../'
import ChoiceGroup from '../../ChoiceGroup'
import {ComponentProps} from '../../utils/types'

type Args = ComponentProps<typeof ChoiceGroup>

export default {
  title: 'Forms/ChoiceGroup/examples',
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

export const RadioChoiceGroup = (args: Args) => (
  <ChoiceGroup {...args}>
    <ChoiceGroup.Label>Choices</ChoiceGroup.Label>
    <FormControl>
      <Radio name="radioInput" value="choiceOne" />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio name="radioInput" value="choiceTwo" />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio name="radioInput" value="choiceThree" />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
  </ChoiceGroup>
)
RadioChoiceGroup.storyName = 'Radio group (default)'

export const CheckboxChoiceGroup = (args: Args) => (
  <ChoiceGroup {...args}>
    <ChoiceGroup.Label>Choices</ChoiceGroup.Label>
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
CheckboxChoiceGroup.parameters = {controls: {exclude: ['id', 'selectionVariant']}}
CheckboxChoiceGroup.storyName = 'Checkbox group'

export const WithCaptionAndValidation = (args: Args) => (
  <ChoiceGroup {...args}>
    <ChoiceGroup.Label>Choices</ChoiceGroup.Label>
    <ChoiceGroup.Caption>You can pick any or all of these choices</ChoiceGroup.Caption>
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
    <ChoiceGroup.Validation variant="error">Your choices are wrong</ChoiceGroup.Validation>
  </ChoiceGroup>
)
