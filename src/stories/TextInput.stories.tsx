import React, {useState} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, ThemeProvider, FormControl, Flash} from '..'
import TextInput, {TextInputProps} from '../TextInput'
import {CalendarIcon, CheckIcon, XCircleFillIcon} from '@primer/octicons-react'
import {
  FormControlArgs,
  formControlArgs,
  formControlArgTypes,
  getFormControlArgsByChildComponent,
  getTextInputArgTypes,
  textInputExcludedControlKeys
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
    }
  ],
  parameters: {controls: {exclude: textInputExcludedControlKeys}},
  args: {
    ...formControlArgs,
    type: 'text',
    onChange: () => {}
  },
  argTypes: {
    type: {
      control: {
        type: 'text'
      }
    },
    ...getTextInputArgTypes(),
    ...formControlArgTypes
  }
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

export const WithLoadingIndicator = (args: FormControlArgs<TextInputProps>) => (
  <Box as="form" sx={{p: 3}}>
    <h3>No visual</h3>
    <Box mb={2}>
      <TextInput value="auto" {...args} />
    </Box>
    <Box mb={2}>
      <TextInput value="leading" {...args} loaderPosition="leading" />
    </Box>
    <Box mb={5}>
      <TextInput value="trailing" {...args} loaderPosition="trailing" />
    </Box>

    <h3>Leading visual</h3>
    <Box mb={2}>
      <TextInput leadingVisual={CalendarIcon} {...args} value="auto" />
    </Box>
    <Box mb={2}>
      <TextInput leadingVisual={CalendarIcon} {...args} loaderPosition="leading" value="leading" />
    </Box>
    <Box mb={5}>
      <TextInput leadingVisual={CalendarIcon} {...args} loaderPosition="trailing" value="trailing" />
    </Box>

    <h3>Trailing visual</h3>
    <Box mb={2}>
      <TextInput trailingVisual={CalendarIcon} {...args} value="auto" />
    </Box>
    <Box mb={2}>
      <TextInput trailingVisual={CalendarIcon} {...args} loaderPosition="leading" value="leading" />
    </Box>
    <Box mb={5}>
      <TextInput trailingVisual={CalendarIcon} {...args} loaderPosition="trailing" value="trailing" />
    </Box>

    <h3>Both visuals</h3>
    <Box mb={2}>
      <TextInput size="small" leadingVisual={CalendarIcon} trailingVisual={CalendarIcon} {...args} value="auto" />
    </Box>
    <Box mb={2}>
      <TextInput
        leadingVisual={CalendarIcon}
        trailingVisual={CalendarIcon}
        {...args}
        loaderPosition="leading"
        value="leading"
      />
    </Box>
    <Box mb={2}>
      <TextInput
        size="large"
        leadingVisual={CalendarIcon}
        trailingVisual={CalendarIcon}
        {...args}
        loaderPosition="trailing"
        value="trailing"
      />
    </Box>
  </Box>
)

WithLoadingIndicator.args = {
  loading: true
}
WithLoadingIndicator.parameters = {
  controls: {
    exclude: [...textInputExcludedControlKeys, 'loaderPosition', ...Object.keys(formControlArgTypes), 'children']
  }
}

export const ValidationOnSubmit = () => {
  const getNameErrors = (value: string) => {
    if (!value.replace(/\s/g, '').length) {
      return ['nameEmpty']
    }

    return []
  }

  const getGHHandleErrors = (value: string) => {
    const validationKeys = []

    if (!value.replace(/\s/g, '').length) {
      validationKeys.push('handleEmpty')
    }

    if (/\s/g.test(value)) {
      validationKeys.push('handleHasSpaces')
    }

    return validationKeys
  }
  const [nameValue, setNameValue] = React.useState<string>('')
  const [nameErrors, setNameErrors] = React.useState<Array<string | undefined>>([])
  const [ghHandleValue, setGHHandleValue] = React.useState<string>('mona lisa')
  const [ghHandleErrors, setGHHandleErrors] = React.useState<Array<string | undefined>>([])
  const [isGHHandleAvailable, setIsGHHandleAvailable] = React.useState<boolean>()
  const [hasSubmissionRun, setHasSubmissionRun] = React.useState<boolean>(false)
  const nameInputRef = React.useRef<HTMLInputElement | null>(null)
  const handleInputRef = React.useRef<HTMLInputElement | null>(null)
  const nameChangeCallback: React.ChangeEventHandler<HTMLInputElement> = event => {
    setNameValue(event.currentTarget.value)

    // remove error if it is corrected after the first validation
    if (nameErrors.length > 0 && getNameErrors(event.currentTarget.value).length === 0) {
      setNameErrors([])
    }
  }
  const ghHandleChangeCallback: React.ChangeEventHandler<HTMLInputElement> = event => {
    setGHHandleValue(event.currentTarget.value)

    // remove errors if they are corrected after the first validation
    if (ghHandleErrors.length > 0 && getGHHandleErrors(event.currentTarget.value).length === 0) {
      setGHHandleErrors([])
    } else {
      // do not show any success message if the field has errors
      setIsGHHandleAvailable(false)
    }
  }

  // validate on submit
  const submitCallback = (event: React.FormEvent<HTMLFormElement>) => {
    const nameFieldErrors = getNameErrors(nameValue)
    const handleFieldErrors = getGHHandleErrors(ghHandleValue)

    event.preventDefault()

    setHasSubmissionRun(true)
    setNameErrors(nameFieldErrors)
    if (handleFieldErrors.length) {
      setGHHandleErrors(handleFieldErrors)
    } else {
      // mark the handle as available if there are no errors
      setIsGHHandleAvailable(true)
    }

    // focus the first field with errors
    if (nameFieldErrors.length && nameInputRef.current) {
      nameInputRef.current.focus()
    }

    if (!nameFieldErrors.length && handleFieldErrors.length && handleInputRef.current) {
      handleInputRef.current.focus()
    }
  }

  // after the first validation, re-run validation on blur
  const nameBlurCallback = () => {
    if (hasSubmissionRun) {
      setNameErrors(getNameErrors(nameValue))
    }
  }

  // after the first validation, re-run validation on blur
  const ghHandleBlurCallback = () => {
    const errors = getGHHandleErrors(ghHandleValue)

    if (hasSubmissionRun) {
      setGHHandleErrors(errors)
      // for this example, any handle that passes validation is "available"
      setIsGHHandleAvailable(!errors.length)
    }
  }

  return (
    <Box
      display="grid"
      gridGap={3}
      as="form"
      // typescript complains unless we cast `submitCallback` with `React.FormEventHandler<HTMLDivElement>`
      onSubmit={submitCallback as React.FormEventHandler<HTMLDivElement> & React.FormEventHandler<HTMLFormElement>}
      noValidate
    >
      <FormControl required>
        <FormControl.Label>Name</FormControl.Label>
        <TextInput
          block
          value={nameValue}
          onChange={nameChangeCallback}
          onBlur={nameBlurCallback}
          autoFocus={nameErrors.includes('nameEmpty')}
          ref={nameInputRef}
        />
        {nameErrors.includes('nameEmpty') && (
          <FormControl.Validation variant="error">A name is required</FormControl.Validation>
        )}
      </FormControl>

      <FormControl required>
        <FormControl.Label>GitHub handle</FormControl.Label>
        <TextInput
          block
          value={ghHandleValue}
          onChange={ghHandleChangeCallback}
          onBlur={ghHandleBlurCallback}
          ref={handleInputRef}
        />
        {ghHandleErrors.includes('handleHasSpaces') && (
          <FormControl.Validation variant="error">GitHub handles cannot contain spaces</FormControl.Validation>
        )}
        {ghHandleErrors.includes('handleEmpty') && (
          <FormControl.Validation variant="error">A handle is required</FormControl.Validation>
        )}
        {isGHHandleAvailable === true && (
          <FormControl.Validation variant="success">{ghHandleValue} is available</FormControl.Validation>
        )}
        <FormControl.Caption>
          With or without &quot;@&quot;. For example &quot;monalisa&quot; or &quot;@monalisa&quot;
        </FormControl.Caption>
      </FormControl>

      <Box as="button" type="submit" justifySelf="flex-start">
        Submit
      </Box>
    </Box>
  )
}

export const ValidationAlertAfterSubmit = () => {
  return (
    <>
      <Box mb={3}>
        <Flash variant="danger" sx={{fontSize: 1}}>
          The following inputs have errors:{' '}
          <Box as="ul" display="inline-flex" p={0} m={0} sx={{listStyle: 'none'}}>
            <Box as="li">
              <a href="#firstname">First name</a>,
            </Box>{' '}
            <Box as="li" ml={1}>
              <a href="#lastname">Last name,</a>
            </Box>
            <Box as="li" ml={1}>
              <a href="#handle">GitHub handle</a>
            </Box>
          </Box>
        </Flash>
      </Box>
      <Box display="grid" gridGap={3} as="form" noValidate>
        <FormControl required id="firstname">
          <FormControl.Label>First name</FormControl.Label>
          <TextInput block value="" />
          <FormControl.Validation variant="error">A first name is required</FormControl.Validation>
        </FormControl>

        <FormControl required id="lastname">
          <FormControl.Label>Last name</FormControl.Label>
          <TextInput block value="" />
          <FormControl.Validation variant="error">A last name is required</FormControl.Validation>
        </FormControl>

        <FormControl required id="handle">
          <FormControl.Label>GitHub handle</FormControl.Label>
          <TextInput block value="mona lisa" />
          <FormControl.Validation variant="error">A handle is required</FormControl.Validation>
        </FormControl>

        <FormControl required>
          <FormControl.Label>Location</FormControl.Label>
          <TextInput block value="San Francisco, CA" />
        </FormControl>

        <Box as="button" type="submit" justifySelf="flex-start">
          Submit
        </Box>
      </Box>
    </>
  )
}
