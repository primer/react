import React from 'react'
import type {Meta} from '@storybook/react'
import type {RadioProps} from '..'
import {Box, FormControl, Radio} from '..'
import type {FormControlArgs} from '../utils/form-story-helpers'
import {
  formControlArgs,
  formControlArgTypesWithoutValidation,
  getFormControlArgsByChildComponent,
} from '../utils/form-story-helpers'

const excludedControlKeys = ['required', 'value', 'name', 'validationStatus', 'sx']

export default {
  title: 'Components/Radio',
  component: Radio,
  parameters: {controls: {exclude: excludedControlKeys}},
} as Meta

export const Playground = ({value: _value, ...args}: FormControlArgs<RadioProps>) => {
  const {parentArgs, labelArgs, captionArgs} = getFormControlArgsByChildComponent(args)

  return (
    <Box as="form">
      <FormControl {...parentArgs}>
        <Radio name="default-radio-name" value="default" {...args} />
        <FormControl.Label {...labelArgs} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
      </FormControl>
    </Box>
  )
}
Playground.argTypes = {
  checked: {
    control: {
      type: 'boolean',
    },
  },
  ...formControlArgTypesWithoutValidation,
}
Playground.args = {
  checked: false,
  ...formControlArgs,
}

export const Default = () => (
  <Box as="form">
    <FormControl>
      <Radio name="default-radio-name" value="default" />
      <FormControl.Label>Label</FormControl.Label>
    </FormControl>
  </Box>
)
