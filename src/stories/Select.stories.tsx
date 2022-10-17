import React from 'react'
import {Meta} from '@storybook/react'

import {Select, FormControl, Box} from '..'
import {SelectProps} from '../Select'
import {
  FormControlArgs,
  formControlArgs,
  formControlArgTypes,
  getFormControlArgsByChildComponent,
  inputWrapperArgTypes
} from '../utils/story-helpers'

export default {
  title: 'Components/Forms/Select',
  component: Select,
  args: {
    ...formControlArgs,
    required: false
  },
  argTypes: {
    ...inputWrapperArgTypes,
    ...formControlArgTypes
  },
  parameters: {
    controls: {
      exclude: ['contrast', 'hasTrailingAction', 'monospace', 'isInputFocused', 'sx', 'size']
    }
  }
} as Meta

export const Default = (args: FormControlArgs<SelectProps>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label {...labelArgs} />
        <Select {...args}>
          <Select.Option value="one">Choice one</Select.Option>
          <Select.Option value="two">Choice two</Select.Option>
          <Select.Option value="three">Choice three</Select.Option>
          <Select.Option value="four">Choice four</Select.Option>
          <Select.Option value="five">Choice five</Select.Option>
          <Select.Option value="six">Choice six</Select.Option>
        </Select>
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </Box>
  )
}
Default.args = {
  labelChildren: 'Choice'
}

export const WithOptionGroups = (args: FormControlArgs<SelectProps>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label {...labelArgs} />
        <Select {...args}>
          <Select.OptGroup label="Group one">
            <Select.Option value="one">Choice one</Select.Option>
            <Select.Option value="two">Choice two</Select.Option>
            <Select.Option value="three">Choice three</Select.Option>
            <Select.Option value="four">Choice four</Select.Option>
          </Select.OptGroup>
          <Select.OptGroup disabled label="Group two">
            <Select.Option value="five">Choice five</Select.Option>
            <Select.Option value="six">Choice six</Select.Option>
          </Select.OptGroup>
        </Select>
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </Box>
  )
}
WithOptionGroups.args = {
  labelChildren: 'Choice'
}
