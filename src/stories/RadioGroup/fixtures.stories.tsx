import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, Box, RadioGroup, FormControl, ThemeProvider, Radio} from '../../'
import {CheckboxOrRadioGroupArgs} from '../../utils/story-helpers'

const excludedControlKeys = ['aria-labelledby', 'id', 'name', 'onChange', 'sx', 'visuallyHidden']

export default {
  title: 'Components/Forms/RadioGroup/fixtures',
  component: RadioGroup,
  argTypes: {
    // RadioGroup
    disabled: {
      defaultValue: false,
      type: 'boolean'
    },
    required: {
      defaultValue: false,
      type: 'boolean'
    },

    // RadioGroup.Label
    labelChildren: {
      defaultValue: 'Choices',
      type: 'string',
      table: {
        category: 'RadioGroup.Label'
      }
    },
    visuallyHidden: {
      defaultValue: false,
      type: 'boolean',
      table: {
        category: 'RadioGroup.Label'
      }
    },

    // RadioGroup.Caption
    captionChildren: {
      defaultValue: '',
      type: 'string',
      table: {
        category: 'RadioGroup.Caption'
      }
    },

    // RadioGroup.Validation
    validationChildren: {
      defaultValue: '',
      type: 'string',
      table: {
        category: 'RadioGroup.Validation'
      }
    },
    variant: {
      defaultValue: 'error',
      control: {
        type: 'radio',
        options: ['error', 'success', 'warning']
      },
      table: {
        category: 'RadioGroup.Validation'
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

export const WithExternalLabel = ({
  disabled,
  required,
  labelChildren,
  captionChildren,
  validationChildren,
  variant
}: CheckboxOrRadioGroupArgs) => {
  const parentArgs = {disabled, required}
  const validationArgs = {children: validationChildren, variant}

  return (
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
        {labelChildren} {parentArgs.required && '*'}
      </Box>
      <RadioGroup aria-labelledby="choiceHeading" name="externalLabelRadioGroup" {...parentArgs}>
        {captionChildren && <RadioGroup.Caption>{captionChildren}</RadioGroup.Caption>}
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
        {validationArgs.children && <RadioGroup.Validation {...validationArgs} />}
      </RadioGroup>
    </>
  )
}
WithExternalLabel.parameters = {controls: {exclude: [...excludedControlKeys, 'visuallyHidden']}}

export const WithHiddenLabel = ({
  disabled,
  required,
  labelChildren,
  visuallyHidden,
  captionChildren,
  validationChildren,
  variant
}: CheckboxOrRadioGroupArgs) => {
  const parentArgs = {disabled, required}
  const labelArgs = {children: labelChildren, visuallyHidden}
  const validationArgs = {children: validationChildren, variant}

  return (
    <RadioGroup name="hiddenLabelRadioGroup" {...parentArgs}>
      {labelArgs.children && <RadioGroup.Label {...labelArgs} />}
      {captionChildren && <RadioGroup.Caption>{captionChildren}</RadioGroup.Caption>}
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
      {validationArgs.children && <RadioGroup.Validation {...validationArgs} />}
    </RadioGroup>
  )
}
WithHiddenLabel.args = {
  visuallyHidden: true
}
