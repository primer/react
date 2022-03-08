import React, {useState} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, ThemeProvider, FormControl} from '..'
import TextInput, {TextInputProps} from '../TextInput'
import {CalendarIcon, CheckIcon, XCircleFillIcon} from '@primer/octicons-react'

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
    isLoading: {
      name: 'isLoading',
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    loaderPosition: {
      name: 'loaderPosition',
      defaultValue: 'auto',
      options: ['auto', 'leading', 'trailing'],
      control: {
        type: 'radio'
      }
    },
    variant: {
      name: 'Variants',
      options: ['small', 'medium', 'large'],
      control: {type: 'radio'}
    },
    validationStatus: {
      name: 'Validation Status',
      options: ['warning', 'error', 'success', undefined],
      control: {type: 'radio'}
    },
    placeholder: {
      name: 'Placeholder',
      defaultValue: 'Hello!',
      control: {
        type: 'text'
      }
    }
  }
} as Meta

export const Default = (args: TextInputProps) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <form>
      <FormControl>
        <FormControl.Label>Example label</FormControl.Label>
        <TextInput value={value} onChange={handleChange} {...args} />
      </FormControl>
    </form>
  )
}

export const WithLeadingVisual = (args: TextInputProps) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <form>
      <FormControl>
        <FormControl.Label>Example label</FormControl.Label>
        <TextInput leadingVisual={CheckIcon} value={value} onChange={handleChange} {...args} />
      </FormControl>
      <FormControl>
        <FormControl.Label>Enter monies</FormControl.Label>
        <TextInput leadingVisual="$" value={value} onChange={handleChange} {...args} />
      </FormControl>
    </form>
  )
}

export const WithTrailingIcon = (args: TextInputProps) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <form>
      <FormControl>
        <FormControl.Label>Example label</FormControl.Label>
        <TextInput trailingVisual={CheckIcon} value={value} onChange={handleChange} {...args} />
      </FormControl>
      <FormControl>
        <FormControl.Label>Enter monies</FormControl.Label>
        <TextInput trailingVisual="minutes" value={value} onChange={handleChange} {...args} placeholder="200" />
      </FormControl>
    </form>
  )
}

export const WithTrailingAction = (args: TextInputProps) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <form>
      <Box display="grid" sx={{gap: 3}}>
        <FormControl>
          <FormControl.Label>Icon action</FormControl.Label>
          <TextInput
            trailingAction={
              <TextInput.Action
                onClick={() => {
                  setValue('')
                }}
                icon={XCircleFillIcon}
                iconLabel="Clear input"
                sx={{color: 'fg.subtle'}}
              />
            }
            value={value}
            onChange={handleChange}
            {...args}
          />
        </FormControl>
        <FormControl>
          <FormControl.Label>Icon action with tooltip</FormControl.Label>
          <TextInput
            trailingAction={
              <TextInput.Action
                onClick={() => {
                  setValue('')
                }}
                icon={XCircleFillIcon}
                iconLabel="Clear input"
                tooltipMessage="Clear"
                sx={{color: 'fg.subtle'}}
              />
            }
            value={value}
            onChange={handleChange}
            {...args}
          />
        </FormControl>
        <FormControl>
          <FormControl.Label>Text action</FormControl.Label>
          <TextInput
            trailingAction={
              <TextInput.Action
                onClick={() => {
                  setValue('')
                }}
              >
                Clear
              </TextInput.Action>
            }
            value={value}
            onChange={handleChange}
            {...args}
          />
        </FormControl>
      </Box>
    </form>
  )
}

export const WithLoadingIndicator = (args: TextInputProps) => {
  const [isLoading, setIsLoading] = useState(true)

  const toggleLoadingState = () => {
    setIsLoading(!isLoading)
  }

  return (
    <form>
      <Box mb={5} display="flex" justifyContent="flex-end">
        <button type="button" onClick={toggleLoadingState}>
          Toggle loading state {isLoading ? 'off' : 'on'}
        </button>
      </Box>

      <Box display="grid" sx={{gap: 3}}>
        <FormControl>
          <FormControl.Label>No visual</FormControl.Label>
          <TextInput isLoading={isLoading} {...args} />
        </FormControl>

        <FormControl>
          <FormControl.Label>Leading visual</FormControl.Label>
          <TextInput isLoading={isLoading} leadingVisual={CalendarIcon} {...args} />
        </FormControl>

        <FormControl>
          <FormControl.Label>Both visuals</FormControl.Label>
          <TextInput isLoading={isLoading} leadingVisual={CalendarIcon} trailingVisual={CalendarIcon} {...args} />
        </FormControl>
      </Box>
    </form>
  )
}

WithLoadingIndicator.parameters = {controls: {exclude: ['isLoading']}}

export const ContrastTextInput = (args: TextInputProps) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <form>
      <FormControl>
        <FormControl.Label>Example label</FormControl.Label>
        <TextInput contrast value={value} onChange={handleChange} {...args} />
      </FormControl>
    </form>
  )
}

export const Password = (args: TextInputProps) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <form>
      <FormControl>
        <FormControl.Label>Password</FormControl.Label>
        <TextInput type="password" value={value} onChange={handleChange} {...args} />
      </FormControl>
    </form>
  )
}

export const TextInputInWarningState = (args: TextInputProps) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <form>
      <FormControl>
        <FormControl.Label>Password</FormControl.Label>
        <TextInput type="password" value={value} validationStatus="warning" onChange={handleChange} {...args} />
      </FormControl>
    </form>
  )
}
