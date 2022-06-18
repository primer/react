import React, {useLayoutEffect, useRef, useState} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, Checkbox, CheckboxProps, ThemeProvider} from '..'
import {action} from '@storybook/addon-actions'
import FormControl from '../FormControl'

const excludedControlKeys = ['required', 'value', 'validationStatus', 'sx']

export default {
  title: 'Forms/Checkbox',
  component: Checkbox,
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Box paddingTop={5}>{Story()}</Box>
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ],
  parameters: {controls: {exclude: excludedControlKeys}},
  argTypes: {
    checked: {
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    disabled: {
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    indeterminate: {
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    }
  }
} as Meta

// TODO: simplify example to not have a caption and use FormControl to render it
export const Default = ({value: _value, checked, disabled, ...args}: CheckboxProps) => {
  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl id="controlled-checkbox" disabled={disabled}>
        <Checkbox value="default" checked={checked} {...args} />
        <FormControl.Label>Default checkbox</FormControl.Label>
        <FormControl.Caption>
          Always unchecked unless `checked` is set to true in Storybook controls
        </FormControl.Caption>
      </FormControl>
    </Box>
  )
}

export const Controlled = ({value: _value, disabled, ...args}: CheckboxProps) => {
  const [isChecked, setChecked] = useState<boolean>(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    action('Change event triggered')
  }

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl id="controlled-checkbox" disabled={disabled}>
        <Checkbox value="default" onChange={handleChange} checked={isChecked} {...args} />
        <FormControl.Label>Controlled checkbox</FormControl.Label>
        <FormControl.Caption>Checked attribute is controlled by React state update on change</FormControl.Caption>
      </FormControl>
    </Box>
  )
}

Controlled.parameters = {controls: {exclude: [...excludedControlKeys, 'checked']}}

// TODO: Move to a docs example?
// doesn't pass `checked` prop from controls
export const Uncontrolled = ({value: _value, checked: _checked, disabled, ...args}: CheckboxProps) => {
  const checkboxRef = useRef<HTMLInputElement | null>(null)

  useLayoutEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = false
    }
  }, [])

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl id="uncontrolled-checkbox" disabled={disabled}>
        <Checkbox value="uncontrolled-checkbox" id="uncontrolled-checkbox" ref={checkboxRef} {...args} />
        <FormControl.Label>Uncontrolled checkbox</FormControl.Label>
        <FormControl.Caption>Checked attribute is set in a useLayoutEffect hook</FormControl.Caption>
      </FormControl>
    </Box>
  )
}

Uncontrolled.parameters = {controls: {exclude: [...excludedControlKeys, 'checked']}}
