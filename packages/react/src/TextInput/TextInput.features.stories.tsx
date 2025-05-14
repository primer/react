import type React from 'react'
import {useState} from 'react'
import {Box, FormControl, Heading, Stack} from '..'
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
    <Heading as="h2" variant="small">
      Primer form title
    </Heading>
    <FormControl>
      <FormControl.Label visuallyHidden>Primer form label</FormControl.Label>
      <TextInput />
      <FormControl.Caption>Label is visually hidden; the title describes the purpose visually</FormControl.Caption>
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

export const WithLeadingVisual = () => {
  const Checkmark = () => <CheckIcon aria-label="Checkmark" />

  return (
    <Box as="form">
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <TextInput leadingVisual={Checkmark} />
      </FormControl>
      <FormControl>
        <FormControl.Label>Enter monies</FormControl.Label>
        <TextInput leadingVisual="$" />
      </FormControl>
    </Box>
  )
}

export const WithTrailingIcon = () => {
  const Checkmark = () => <CheckIcon aria-label="Checkmark" />

  return (
    <Box>
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <TextInput trailingVisual={Checkmark} />
      </FormControl>
      <FormControl>
        <FormControl.Label>Enter monies</FormControl.Label>
        <TextInput trailingVisual="minutes" placeholder="200" />
      </FormControl>
    </Box>
  )
}

export const WithTrailingAction = () => {
  const [value, setValue] = useState('sample text')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  return (
    <Box as="form">
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <TextInput
          value={value}
          onChange={handleChange}
          trailingAction={
            <Stack justify="center" style={{minWidth: '34px'}}>
              {value.length ? (
                <TextInput.Action onClick={() => setValue('')} icon={XCircleFillIcon} aria-label="Clear input" />
              ) : undefined}
            </Stack>
          }
        />
      </FormControl>
    </Box>
  )
}

export const WithTooltipDirection = () => {
  const [value, setValue] = useState('sample text')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  return (
    <Box as="form">
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <TextInput
          value={value}
          onChange={handleChange}
          trailingAction={
            <Stack justify="center" style={{minWidth: '34px'}}>
              {value.length ? (
                <TextInput.Action
                  onClick={() => setValue('')}
                  icon={XCircleFillIcon}
                  aria-label="Clear input"
                  tooltipDirection="nw"
                />
              ) : undefined}
            </Stack>
          }
        />
      </FormControl>
    </Box>
  )
}

const Calendar = () => <CalendarIcon aria-label="Calendar" />

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
          <TextInput leadingVisual={Calendar} {...args} value="auto" />
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput leadingVisual={Calendar} {...args} loaderPosition="leading" value="leading" />
        </FormControl>
      </Box>
      <Box mb={5}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput leadingVisual={Calendar} {...args} loaderPosition="trailing" value="trailing" />
        </FormControl>
      </Box>

      <h3>Trailing visual</h3>
      <FormControl>
        <Box mb={2}>
          <FormControl>
            <FormControl.Label>Default label</FormControl.Label>
            <TextInput trailingVisual={Calendar} {...args} value="auto" />
          </FormControl>
        </Box>
        <Box mb={2}>
          <FormControl>
            <FormControl.Label>Default label</FormControl.Label>
            <TextInput trailingVisual={Calendar} {...args} loaderPosition="leading" value="leading" />
          </FormControl>
        </Box>
        <Box mb={5}>
          <FormControl>
            <FormControl.Label>Default label</FormControl.Label>
            <TextInput trailingVisual={Calendar} {...args} loaderPosition="trailing" value="trailing" />
          </FormControl>
        </Box>
      </FormControl>

      <h3>Both visuals</h3>

      <Box mb={2}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput size="small" leadingVisual={Calendar} trailingVisual={Calendar} {...args} value="auto" />
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput
            leadingVisual={Calendar}
            trailingVisual={Calendar}
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
            leadingVisual={Calendar}
            trailingVisual={Calendar}
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

export const WithAutocompleteAttribute = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>First name</FormControl.Label>
      <TextInput autoComplete="given-name" />
    </FormControl>
    <FormControl>
      <FormControl.Label>Last name</FormControl.Label>
      <TextInput autoComplete="family-name" />
    </FormControl>
  </Box>
)
