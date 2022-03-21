import React, {useState, ReactNode} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, ThemeProvider, Text} from '..'
import TextInput, {TextInputProps} from '../TextInput'
import {CalendarIcon, CheckIcon} from '@primer/octicons-react'

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
    loading: {
      name: 'loading',
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
    monospace: {
      name: 'Monospace',
      defaultValue: false,
      control: {
        type: 'boolean'
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

export const WithLeadingVisual = (args: TextInputProps) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const iconInputId = 'text-input-with-leading-icon'
  const leadingTextId = 'text-input-with-leading-text'

  return (
    <form>
      <Label htmlFor={iconInputId}>Example label</Label>
      <TextInput leadingVisual={CheckIcon} id={iconInputId} value={value} onChange={handleChange} {...args} />
      <br />
      <Label htmlFor={leadingTextId}>Enter monies</Label>
      <TextInput leadingVisual="$" id={leadingTextId} value={value} onChange={handleChange} {...args} />
    </form>
  )
}

export const WithTrailingIcon = (args: TextInputProps) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const iconInputId = 'text-input-with-trailing-icon'
  const trailingTextInputId = 'text-input-with-trailing-text'

  return (
    <form>
      <Label htmlFor={iconInputId}>Example label</Label>
      <TextInput trailingVisual={CheckIcon} id={iconInputId} value={value} onChange={handleChange} {...args} />
      <br />
      <Label htmlFor={trailingTextInputId}>Time in minutes</Label>
      <TextInput
        trailingVisual="minutes"
        id={trailingTextInputId}
        value={value}
        onChange={handleChange}
        sx={{width: '150px'}}
        {...args}
        placeholder="200"
      />
    </form>
  )
}

export const WithLoadingIndicator = () => {
  const [loading, setLoading] = React.useState(true)

  const toggleLoadingState = () => {
    setLoading(!loading)
  }

  return (
    <>
      <Box mb={5}>
        <button type="button" onClick={toggleLoadingState}>
          Toggle loading state {loading ? 'off' : 'on'}
        </button>
      </Box>

      <h3>No visual</h3>
      <Box mb={2}>
        <TextInput value="auto" loading={loading} />
      </Box>
      <Box mb={2}>
        <TextInput value="leading" loading={loading} loaderPosition="leading" />
      </Box>
      <Box mb={5}>
        <TextInput value="trailing" loading={loading} loaderPosition="trailing" />
      </Box>

      <h3>Leading visual</h3>
      <Box mb={2}>
        <TextInput leadingVisual={CalendarIcon} loading={loading} value="auto" />
      </Box>
      <Box mb={2}>
        <TextInput leadingVisual={CalendarIcon} loading={loading} loaderPosition="leading" value="leading" />
      </Box>
      <Box mb={5}>
        <TextInput leadingVisual={CalendarIcon} loading={loading} loaderPosition="trailing" value="trailing" />
      </Box>

      <h3>Trailing visual</h3>
      <Box mb={2}>
        <TextInput trailingVisual={CalendarIcon} loading={loading} value="auto" />
      </Box>
      <Box mb={2}>
        <TextInput trailingVisual={CalendarIcon} loading={loading} loaderPosition="leading" value="leading" />
      </Box>
      <Box mb={5}>
        <TextInput trailingVisual={CalendarIcon} loading={loading} loaderPosition="trailing" value="trailing" />
      </Box>

      <h3>Both visuals</h3>
      <Box mb={2}>
        <TextInput
          size="small"
          leadingVisual={CalendarIcon}
          trailingVisual={CalendarIcon}
          loading={loading}
          value="auto"
        />
      </Box>
      <Box mb={2}>
        <TextInput
          leadingVisual={CalendarIcon}
          trailingVisual={CalendarIcon}
          loading={loading}
          loaderPosition="leading"
          value="leading"
        />
      </Box>
      <Box mb={2}>
        <TextInput
          size="large"
          leadingVisual={CalendarIcon}
          trailingVisual={CalendarIcon}
          loading={loading}
          loaderPosition="trailing"
          value="trailing"
        />
      </Box>
    </>
  )
}

WithLoadingIndicator.parameters = {controls: {exclude: ['loading']}}

export const ContrastTextInput = (args: TextInputProps) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const inputId = 'contrast-text-input'

  return (
    <form>
      <Label htmlFor={inputId}>Example label</Label>
      <br />
      <TextInput contrast id={inputId} value={value} onChange={handleChange} {...args} />
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

export const TextInputInWarningState = (args: TextInputProps) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const inputId = 'text-input-with-warning'

  return (
    <form>
      <Label htmlFor={inputId}>Password</Label>
      <br />
      <TextInput
        type="password"
        id={inputId}
        value={value}
        validationStatus="warning"
        onChange={handleChange}
        {...args}
      />
    </form>
  )
}
