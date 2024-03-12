import React, {useState} from 'react'
import {Box, FormControl} from '..'
import type {TextInputProps} from '../TextInput'
import TextInput from '../TextInput'
import {CalendarIcon, CheckIcon, XCircleFillIcon} from '@primer/octicons-react'
import type {FormControlArgs} from '../utils/story-helpers'
import {formControlArgTypes, textInputExcludedControlKeys} from '../utils/story-helpers'

export default {
  title: 'Components/TextInput/Features',
}

export const Disabled = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput disabled />
    </FormControl>
  </Box>
)

export const WithCaption = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <FormControl.Caption>This is a caption</FormControl.Caption>
      <TextInput />
    </FormControl>
  </Box>
)

export const VisuallyHiddenLabel = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label visuallyHidden>Default label</FormControl.Label>
      <TextInput />
    </FormControl>
  </Box>
)

export const Error = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput />
      <FormControl.Validation variant="error">Something went wrong</FormControl.Validation>
    </FormControl>
  </Box>
)

export const Success = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput />
      <FormControl.Validation variant="success">Something went wrong</FormControl.Validation>
    </FormControl>
  </Box>
)

export const Block = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput block />
    </FormControl>
  </Box>
)

export const Small = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput size="small" />
    </FormControl>
  </Box>
)

export const Large = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput size="large" />
    </FormControl>
  </Box>
)

export const Required = () => (
  <Box as="form">
    <FormControl required>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput size="large" />
    </FormControl>
  </Box>
)

export const WithLeadingVisual = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput leadingVisual={CheckIcon} />
    </FormControl>
    <FormControl>
      <FormControl.Label>Enter monies</FormControl.Label>
      <TextInput leadingVisual="$" />
    </FormControl>
  </Box>
)

export const WithTrailingIcon = () => (
  <Box>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput trailingVisual={CheckIcon} />
    </FormControl>
    <FormControl>
      <FormControl.Label>Enter monies</FormControl.Label>
      <TextInput trailingVisual="minutes" placeholder="200" />
    </FormControl>
  </Box>
)

export const WithTrailingAction = () => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  return (
    <Box as="form">
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
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
        />
      </FormControl>
    </Box>
  )
}

export const WithTooltipDirection = () => {
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  return (
    <Box as="form">
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <TextInput
          trailingAction={
            <TextInput.Action
              onClick={() => {
                setValue('')
              }}
              icon={XCircleFillIcon}
              aria-label="Clear input"
              tooltipDirection="nw"
              sx={{color: 'fg.subtle'}}
            />
          }
          value={value}
          onChange={handleChange}
        />
      </FormControl>
    </Box>
  )
}

export const WithLoadingIndicator = (args: FormControlArgs<TextInputProps>) => {
  return (
    <Box as="form">
      <h3>No visual</h3>

      <Box mb={2}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput value="auto" {...args} />
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput value="leading" {...args} loaderPosition="leading" />
        </FormControl>
      </Box>
      <Box mb={5}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput value="trailing" {...args} loaderPosition="trailing" />
        </FormControl>
      </Box>

      <h3>Leading visual</h3>

      <Box mb={2}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput leadingVisual={CalendarIcon} {...args} value="auto" />
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput leadingVisual={CalendarIcon} {...args} loaderPosition="leading" value="leading" />
        </FormControl>
      </Box>
      <Box mb={5}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput leadingVisual={CalendarIcon} {...args} loaderPosition="trailing" value="trailing" />
        </FormControl>
      </Box>

      <h3>Trailing visual</h3>
      <FormControl>
        <Box mb={2}>
          <FormControl>
            <FormControl.Label>Default label</FormControl.Label>
            <TextInput trailingVisual={CalendarIcon} {...args} value="auto" />
          </FormControl>
        </Box>
        <Box mb={2}>
          <FormControl>
            <FormControl.Label>Default label</FormControl.Label>
            <TextInput trailingVisual={CalendarIcon} {...args} loaderPosition="leading" value="leading" />
          </FormControl>
        </Box>
        <Box mb={5}>
          <FormControl>
            <FormControl.Label>Default label</FormControl.Label>
            <TextInput trailingVisual={CalendarIcon} {...args} loaderPosition="trailing" value="trailing" />
          </FormControl>
        </Box>
      </FormControl>

      <h3>Both visuals</h3>

      <Box mb={2}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput size="small" leadingVisual={CalendarIcon} trailingVisual={CalendarIcon} {...args} value="auto" />
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput
            leadingVisual={CalendarIcon}
            trailingVisual={CalendarIcon}
            {...args}
            loaderPosition="leading"
            value="leading"
          />
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput
            size="large"
            leadingVisual={CalendarIcon}
            trailingVisual={CalendarIcon}
            {...args}
            loaderPosition="trailing"
            value="trailing"
          />
        </FormControl>
      </Box>
    </Box>
  )
}

WithLoadingIndicator.args = {
  loading: true,
}
WithLoadingIndicator.parameters = {
  controls: {
    exclude: [...textInputExcludedControlKeys, 'loaderPosition', ...Object.keys(formControlArgTypes), 'children'],
  },
}
