import React, {useState, ReactNode} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, ThemeProvider, Text} from '..'
import TextInput, {TextInputProps} from '../TextInput'
import {CheckIcon} from '@primer/octicons-react'

export default {
  title: 'Forms/Text Input',
  component: TextInput,
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
    sx: {
      table: {
        disable: true
      }
    },
    block: {
      name: 'Block',
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    disabled: {
      name: 'Disabled',
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    variant: {
      name: 'Variants',
      options: ['small', 'medium', 'large'],
      control: {type: 'radio'}
    }
  }
} as Meta

const Label = ({htmlFor, children}: {htmlFor: string; children: ReactNode}) => (
  <Text as="label" htmlFor={htmlFor} sx={{fontWeight: 600, fontSize: 14}}>
    {children}
  </Text>
)

export const Default = (args: TextInputProps) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const inputId = 'basic-text-input'

  return (
    <form>
      <div className="form-group">
        <div className="form-group-header">
          <Label htmlFor={inputId}>Example label</Label>
        </div>
        <div className="form-group-body">
          <TextInput id={inputId} value={value} onChange={handleChange} {...args} />
        </div>
      </div>
    </form>
  )
}

export const WithLeadingIcon = (args: TextInputProps) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const inputId = 'basic-text-input-with-leading-icon'

  return (
    <form>
      <Label htmlFor={inputId}>Example label</Label>
      <br />
      <TextInput icon={CheckIcon} id={inputId} value={value} onChange={handleChange} type="password" {...args} />
    </form>
  )
}

export const Password = (args: TextInputProps) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const inputId = 'basic-text-input-as-password'

  return (
    <form>
      <Label htmlFor={inputId}>Password</Label>
      <br />
      <TextInput type="password" id={inputId} value={value} onChange={handleChange} {...args} />
    </form>
  )
}
