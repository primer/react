import React, {useState} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, ThemeProvider, FormControl} from '..'
import TextInput, {TextInputProps} from '../TextInput'
import {CalendarIcon, CheckIcon, XCircleFillIcon} from '@primer/octicons-react'
import {getTextInputArgTypes, textInputExcludedControlKeys} from '../utils/story-helpers'

type Args = TextInputProps & {inputSize?: 'small' | 'medium' | 'large'}

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
  parameters: {controls: {exclude: textInputExcludedControlKeys}},
  argTypes: getTextInputArgTypes()
} as Meta

export const Default = ({inputSize, ...args}: Args) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <form>
      <FormControl>
        <FormControl.Label>Example label</FormControl.Label>
        <TextInput value={value} onChange={handleChange} {...args} size={inputSize} />
      </FormControl>
    </form>
  )
}

export const WithLeadingVisual = ({inputSize, ...args}: Args) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <form>
      <FormControl>
        <FormControl.Label>Example label</FormControl.Label>
        <TextInput leadingVisual={CheckIcon} value={value} onChange={handleChange} {...args} size={inputSize} />
      </FormControl>
      <FormControl>
        <FormControl.Label>Enter monies</FormControl.Label>
        <TextInput leadingVisual="$" value={value} onChange={handleChange} {...args} size={inputSize} />
      </FormControl>
    </form>
  )
}

export const WithTrailingIcon = ({inputSize, ...args}: Args) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <form>
      <FormControl>
        <FormControl.Label>Example label</FormControl.Label>
        <TextInput trailingVisual={CheckIcon} value={value} onChange={handleChange} {...args} size={inputSize} />
      </FormControl>
      <FormControl>
        <FormControl.Label>Enter monies</FormControl.Label>
        <TextInput
          trailingVisual="minutes"
          value={value}
          onChange={handleChange}
          {...args}
          size={inputSize}
          placeholder="200"
        />
      </FormControl>
    </form>
  )
}

export const WithTrailingAction = ({inputSize, ...args}: Args) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <form>
      <FormControl>
        <FormControl.Label>Icon action</FormControl.Label>
        <TextInput
          trailingAction={
            <TextInput.Action
              onClick={() => {
                setValue('')
              }}
              icon={XCircleFillIcon}
              aria-label="Clear input"
              sx={{color: 'fg.subtle'}}
            />
          }
          value={value}
          onChange={handleChange}
          {...args}
          size={inputSize}
        />
      </FormControl>
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

export const ContrastTextInput = ({inputSize, ...args}: Args) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <form>
      <FormControl>
        <FormControl.Label>Example label</FormControl.Label>
        <TextInput contrast value={value} onChange={handleChange} {...args} size={inputSize} />
      </FormControl>
    </form>
  )
}

export const Password = ({inputSize, ...args}: Args) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <form>
      <FormControl>
        <FormControl.Label>Password</FormControl.Label>
        <TextInput type="password" value={value} onChange={handleChange} {...args} size={inputSize} />
      </FormControl>
    </form>
  )
}

export const TextInputInWarningState = ({inputSize, ...args}: Args) => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <form>
      <FormControl>
        <FormControl.Label>Password</FormControl.Label>
        <TextInput
          type="password"
          value={value}
          validationStatus="warning"
          onChange={handleChange}
          {...args}
          size={inputSize}
        />
      </FormControl>
    </form>
  )
}
