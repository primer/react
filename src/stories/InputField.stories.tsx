import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, ThemeProvider, Text, Box, TextInput} from '..'
import InputField from '../InputField'
import {get} from '../constants'
import ToggleInputField from '../InputField/ToggleInputField'

const SingleExampleContainer: React.FC<{label?: string}> = ({children, label}) => (
  <Box
    display="flex"
    sx={{
      alignItems: 'start',
      flexDirection: 'column',
      gap: get('space.0')
    }}
  >
    {label ? (
      <Text fontSize={0} color="fg.subtle">
        {label}
      </Text>
    ) : null}
    {children}
  </Box>
)

const ExampleCollectionContainer: React.FC = ({children}) => (
  <Box
    display="flex"
    sx={{
      alignItems: 'start',
      flexDirection: 'column',
      gap: get('space.6')
    }}
  >
    {children}
  </Box>
)

const SimpleCheckboxInput: React.FC<React.HTMLProps<HTMLInputElement>> = props => <input type="checkbox" {...props} />

export default {
  title: 'Forms/InputField',
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ]
} as Meta

export const Default = () => {
  return (
    <ExampleCollectionContainer>
      <SingleExampleContainer label="Default">
        <InputField id="defaultInputField">
          <InputField.Label>Name</InputField.Label>
          <InputField.Input as={TextInput} />
          <InputField.Caption>Hint: your first name</InputField.Caption>
        </InputField>
      </SingleExampleContainer>
      <SingleExampleContainer label="Required">
        <InputField id="required-defaultInputField" required>
          <InputField.Label>Name</InputField.Label>
          <InputField.Input as={TextInput} />
          <InputField.Caption>
            Hint: your first name. <a href="http://google.com">More Info</a>
          </InputField.Caption>
        </InputField>
      </SingleExampleContainer>
    </ExampleCollectionContainer>
  )
}

export const Toggle = () => {
  return (
    <ExampleCollectionContainer>
      <SingleExampleContainer label="Default">
        <ToggleInputField id="defaultInputField">
          <InputField.Label>Name</InputField.Label>
          <InputField.Input as={SimpleCheckboxInput} />
          <InputField.Caption>Hint: your first name</InputField.Caption>
        </ToggleInputField>
      </SingleExampleContainer>
      <SingleExampleContainer label="Required">
        <ToggleInputField id="required-defaultInputField">
          <InputField.Label>Name</InputField.Label>
          <InputField.Input as={SimpleCheckboxInput} />
          <InputField.Caption>
            Hint: your first name. <a href="http://google.com">More Info</a>
          </InputField.Caption>
        </ToggleInputField>
      </SingleExampleContainer>
    </ExampleCollectionContainer>
  )
}

export const WithValidation = () => {
  return (
    <ExampleCollectionContainer>
      <SingleExampleContainer label="Error">
        <InputField id="errored-defaultInputField" validationStatus="error">
          <InputField.Label>Name</InputField.Label>
          <InputField.Input as={TextInput} />
          <InputField.Validation>
            Invalid name, try a different one. <a href="http://google.com">More Info</a>
          </InputField.Validation>
          <InputField.Caption>
            Hint: your first name. <a href="http://google.com">More Info</a>
          </InputField.Caption>
        </InputField>
      </SingleExampleContainer>
      <SingleExampleContainer label="Successs">
        <InputField id="success-defaultInputField" validationStatus="success">
          <InputField.Label>Name</InputField.Label>
          <InputField.Input as={TextInput} />
          <InputField.Validation>
            Wow, such a cool name. <a href="http://google.com">More Info</a>
          </InputField.Validation>
          <InputField.Caption>
            Hint: your first name. <a href="http://google.com">More Info</a>
          </InputField.Caption>
        </InputField>
      </SingleExampleContainer>
    </ExampleCollectionContainer>
  )
}
