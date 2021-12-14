import React, {useState} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, ThemeProvider} from '..'
import {SelectInput, SelectInputProps} from '.'

export default {
  title: 'Forms/Select Input',
  component: SelectInput,
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
  argTypes: {
    disabled: {
      name: 'Disabled',
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    size: {
      name: 'Sizes',
      options: ['small', 'medium', 'large'],
      control: {type: 'radio'}
    }
  }
} as Meta

export const Default = ({...args}: SelectInputProps) => {
  const [selectedValue, setSelected] = useState<string | undefined>(undefined)
  const handleChange = () => {
    setSelected(selectedValue)
  }

  return (
    <>
      <Box as="form" p={3} sx={{display: 'flex', alignItems: 'flex-start'}}>
        <SelectInput selectedValue={selectedValue} onSelect={handleChange} {...args}>
          <SelectInput.Option value="">Choose your option</SelectInput.Option>
          <SelectInput.Option value="1">1</SelectInput.Option>
          <SelectInput.Option value="2">2</SelectInput.Option>
          <SelectInput.Option value="3">3</SelectInput.Option>
        </SelectInput>
      </Box>
    </>
  )
}
