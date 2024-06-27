import React from 'react'
import type {Meta} from '@storybook/react'
import type {CheckboxProps} from '..'
import {Box, Checkbox} from '..'
import FormControl from '../FormControl'
import type {FormControlArgs} from '../utils/form-story-helpers'
import {formControlArgTypesWithoutValidation, getFormControlArgsByChildComponent} from '../utils/form-story-helpers'

const excludedControlKeys = ['required', 'value', 'validationStatus', 'sx']

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {controls: {exclude: excludedControlKeys}},
} as Meta

export const Playground = ({value: _value, checked, ...args}: FormControlArgs<CheckboxProps>) => {
  const {parentArgs, labelArgs, captionArgs} = getFormControlArgsByChildComponent(args)

  return (
    <Box as="form">
      <FormControl {...parentArgs}>
        <Checkbox value="default" checked={checked} {...args} />
        <FormControl.Label {...labelArgs} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
      </FormControl>
    </Box>
  )
}
Playground.args = {
  checked: false,
  indeterminate: false,
  visuallyHidden: false,
  disabled: false,
  labelChildren: 'Default checkbox',
  captionChildren: 'Always unchecked unless `checked` is set to true in Storybook controls',
}
Playground.argTypes = {
  ...formControlArgTypesWithoutValidation,
}

export const Default = () => (
  <Box as="form">
    <FormControl>
      <Checkbox value="default" />
      <FormControl.Label>Default label</FormControl.Label>
    </FormControl>
  </Box>
)
