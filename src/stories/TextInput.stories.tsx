import React, {useState} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, ThemeProvider, FormControl} from '..'
import TextInput, {TextInputProps} from '../TextInput'
import {CalendarIcon, CheckIcon, XCircleFillIcon} from '@primer/octicons-react'
import {
  FormControlArgs,
  formControlArgs,
  formControlArgTypes,
  getFormControlArgsByChildComponent,
  getTextInputArgTypes,
  textInputExcludedControlKeys,
} from '../utils/story-helpers'

export default {
  title: 'Components/Forms/TextInput',
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
    },
  ],
  parameters: {controls: {exclude: textInputExcludedControlKeys}},
  args: {
    ...formControlArgs,
    type: 'text',
    onChange: () => {},
  },
  argTypes: {
    type: {
      control: {
        type: 'text',
      },
    },
    ...getTextInputArgTypes(),
    ...formControlArgTypes,
  },
} as Meta

export const Default = (args: FormControlArgs<TextInputProps>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label {...labelArgs} />
        <TextInput value={value} onChange={handleChange} {...args} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </Box>
  )
}

export const WithLeadingVisual = (args: FormControlArgs<TextInputProps>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label {...labelArgs} />
        <TextInput leadingVisual={CheckIcon} value={value} onChange={handleChange} {...args} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
      <FormControl>
        <FormControl.Label>Enter monies</FormControl.Label>
        <TextInput leadingVisual="$" value={value} onChange={handleChange} {...args} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </Box>
  )
}

export const WithTrailingIcon = (args: FormControlArgs<TextInputProps>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label {...labelArgs} />
        <TextInput trailingVisual={CheckIcon} value={value} onChange={handleChange} {...args} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
      <FormControl>
        <FormControl.Label>Enter monies</FormControl.Label>
        <TextInput trailingVisual="minutes" value={value} onChange={handleChange} {...args} placeholder="200" />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </Box>
  )
}

export const WithTrailingAction = (args: FormControlArgs<TextInputProps>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label {...labelArgs} />
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
        />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </Box>
  )
}

export const WithLoadingIndicator = (args: FormControlArgs<TextInputProps>) => {
  const {parentArgs, labelArgs} = getFormControlArgsByChildComponent(args)
  return (
    <Box as="form" sx={{padding: 3}}>
      <h3>No visual</h3>

      <Box mb={2}>
        <FormControl {...parentArgs}>
          <FormControl.Label {...labelArgs} />
          <TextInput value="auto" {...args} />
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl {...parentArgs}>
          <FormControl.Label {...labelArgs} />
          <TextInput value="leading" {...args} loaderPosition="leading" />
        </FormControl>
      </Box>
      <Box mb={5}>
        <FormControl {...parentArgs}>
          <FormControl.Label {...labelArgs} />
          <FormControl.Label {...labelArgs} />
          <TextInput value="trailing" {...args} loaderPosition="trailing" />
        </FormControl>
      </Box>

      <h3>Leading visual</h3>

      <Box mb={2}>
        <FormControl {...parentArgs}>
          <FormControl.Label {...labelArgs} />
          <TextInput leadingVisual={CalendarIcon} {...args} value="auto" />
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl {...parentArgs}>
          <FormControl.Label {...labelArgs} />
          <TextInput leadingVisual={CalendarIcon} {...args} loaderPosition="leading" value="leading" />
        </FormControl>
      </Box>
      <Box mb={5}>
        <FormControl {...parentArgs}>
          <FormControl.Label {...labelArgs} />
          <TextInput leadingVisual={CalendarIcon} {...args} loaderPosition="trailing" value="trailing" />
        </FormControl>
      </Box>

      <h3>Trailing visual</h3>
      <FormControl {...parentArgs}>
        <Box mb={2}>
          <FormControl {...parentArgs}>
            <FormControl.Label {...labelArgs} />
            <TextInput trailingVisual={CalendarIcon} {...args} value="auto" />
          </FormControl>
        </Box>
        <Box mb={2}>
          <FormControl {...parentArgs}>
            <FormControl.Label {...labelArgs} />
            <TextInput trailingVisual={CalendarIcon} {...args} loaderPosition="leading" value="leading" />
          </FormControl>
        </Box>
        <Box mb={5}>
          <FormControl {...parentArgs}>
            <FormControl.Label {...labelArgs} />
            <TextInput trailingVisual={CalendarIcon} {...args} loaderPosition="trailing" value="trailing" />
          </FormControl>
        </Box>
      </FormControl>

      <h3>Both visuals</h3>

      <Box mb={2}>
        <FormControl {...parentArgs}>
          <FormControl.Label {...labelArgs} />
          <TextInput size="small" leadingVisual={CalendarIcon} trailingVisual={CalendarIcon} {...args} value="auto" />
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl {...parentArgs}>
          <FormControl.Label {...labelArgs} />
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
        <FormControl {...parentArgs}>
          <FormControl.Label {...labelArgs} />
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
