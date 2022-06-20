import React, {ChangeEvent, useState} from 'react'
import {Meta} from '@storybook/react'
import styled from 'styled-components'
import {BaseStyles, Box, FormControl, Radio, RadioProps, Text, ThemeProvider} from '..'
import {get} from '../constants'

const excludedControlKeys = ['required', 'value', 'name', 'validationStatus', 'sx']

export default {
  title: 'Forms/Radio',
  component: Radio,
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Box sx={{pt: 3}}>{Story()}</Box>
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ],
  parameters: {controls: {exclude: excludedControlKeys}},
  argTypes: {
    disabled: {
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    checked: {
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    }
  }
} as Meta

const StyledLabel = styled.label`
  user-select: none;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  margin-left: 8px;
  display: flex;
  cursor: pointer;

  &:first-child {
    margin-left: 0;
  }

  &[aria-disabled='true'] {
    pointer-events: none;
    cursor: not-allowed;
    color: ${get('colors.primer.fg.disabled')};
  }
`

export const Default = ({disabled, value: _value, ...args}: RadioProps) => {
  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl id="default-radio-id" disabled={disabled}>
        <Radio name="default-radio-name" value="default" {...args} />
        <FormControl.Label>Default radio button</FormControl.Label>
      </FormControl>
    </Box>
  )
}
