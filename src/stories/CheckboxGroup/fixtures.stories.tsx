import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, Box, Checkbox, CheckboxGroup, FormControl, ThemeProvider} from '../../'
import {CheckboxOrRadioGroupArgs} from '../../utils/story-helpers'

const excludedControlKeys = ['aria-labelledby', 'id', 'onChange', 'sx', 'visuallyHidden']

export default {
  title: 'Components/Forms/CheckboxGroup/fixtures',
  component: CheckboxGroup,
  argTypes: {
    // CheckboxGroup
    disabled: {
      defaultValue: false,
      type: 'boolean'
    },
    required: {
      defaultValue: false,
      type: 'boolean'
    },

    // CheckboxGroup.Label
    labelChildren: {
      defaultValue: 'Choices',
      type: 'string',
      table: {
        category: 'CheckboxGroup.Label'
      }
    },
    visuallyHidden: {
      defaultValue: false,
      type: 'boolean',
      table: {
        category: 'CheckboxGroup.Label'
      }
    },

    // CheckboxGroup.Caption
    captionChildren: {
      defaultValue: '',
      type: 'string',
      table: {
        category: 'CheckboxGroup.Caption'
      }
    },

    // CheckboxGroup.Validation
    validationChildren: {
      defaultValue: '',
      type: 'string',
      table: {
        category: 'CheckboxGroup.Validation'
      }
    },
    variant: {
      defaultValue: 'error',
      control: {
        type: 'radio',
        options: ['error', 'success', 'warning']
      },
      table: {
        category: 'CheckboxGroup.Validation'
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
      <CheckboxGroup aria-labelledby="choiceHeading" {...parentArgs}>
        {captionChildren && <CheckboxGroup.Caption>{captionChildren}</CheckboxGroup.Caption>}
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
        {validationArgs.children && <CheckboxGroup.Validation {...validationArgs} />}
      </CheckboxGroup>
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
    <CheckboxGroup {...parentArgs}>
      {labelArgs.children && <CheckboxGroup.Label {...labelArgs} />}
      {captionChildren && <CheckboxGroup.Caption>{captionChildren}</CheckboxGroup.Caption>}
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
      {validationArgs.children && <CheckboxGroup.Validation {...validationArgs} />}
    </CheckboxGroup>
  )
}
WithHiddenLabel.args = {
  visuallyHidden: true
}
