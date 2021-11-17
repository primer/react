import React, {ChangeEventHandler, useState} from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, ThemeProvider, Text, Box, TextInput} from '..'
import InputField from '../InputField'
import {get} from '../constants'
import ToggleInputField from '../InputField/ToggleInputField'
import ChoiceFieldset from '../ChoiceFieldset/ChoiceFieldset'
import ChoiceField from '../ChoiceFieldset/ChoiceField'
import {MarkGithubIcon} from '@primer/octicons-react'

const SingleExampleContainer: React.FC<{label?: string}> = ({children, label}) => (
  <Box
    display="flex"
    sx={{
      alignItems: 'stretch',
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
      alignItems: 'stretch',
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
          <InputField.Caption>
            Hint: your first name. <a href="http://google.com">More Info</a>
          </InputField.Caption>
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
      <SingleExampleContainer label="Disabled">
        <InputField id="required-disabledInputField" disabled>
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
        <ToggleInputField id="toggleInputField">
          <InputField.Label>Choice</InputField.Label>
          <InputField.Input as={SimpleCheckboxInput} />
          <InputField.Caption>
            Hint: your first choice. <a href="http://google.com">More Info</a>
          </InputField.Caption>
        </ToggleInputField>
      </SingleExampleContainer>
      <SingleExampleContainer label="Disabled">
        <ToggleInputField id="toggleInputField-disabled" disabled>
          <InputField.Label>Choice</InputField.Label>
          <InputField.Input as={SimpleCheckboxInput} />
          <InputField.Caption>
            Hint: your first choice. <a href="http://google.com">More Info</a>
          </InputField.Caption>
        </ToggleInputField>
      </SingleExampleContainer>
      <SingleExampleContainer label="With a LeadingVisual">
        <ToggleInputField id="toggleInputField-withVisual">
          <InputField.LeadingVisual>
            <MarkGithubIcon />
          </InputField.LeadingVisual>
          <InputField.Label>Choice</InputField.Label>
          <InputField.Input as={SimpleCheckboxInput} />
        </ToggleInputField>
      </SingleExampleContainer>
      <SingleExampleContainer label="With a LeadingVisual and caption">
        <ToggleInputField id="toggleInputField-withVisualAndCap">
          <InputField.LeadingVisual>
            <MarkGithubIcon />
          </InputField.LeadingVisual>
          <InputField.Label>Choice</InputField.Label>
          <InputField.Input as={SimpleCheckboxInput} />
          <InputField.Caption>
            Hint: your first choice. <a href="http://google.com">More Info</a>
          </InputField.Caption>
        </ToggleInputField>
      </SingleExampleContainer>
    </ExampleCollectionContainer>
  )
}

export const CheckboxFieldset = () => {
  return (
    <ExampleCollectionContainer>
      <SingleExampleContainer label="Default">
        <ChoiceFieldset validationStatus="success">
          <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
          <ChoiceFieldset.List selectionVariant="multiple">
            <ChoiceFieldset.ChoiceField>
              <ChoiceField.Input value="labelOne" />
              <ChoiceField.Label>Label one</ChoiceField.Label>
              <ChoiceField.Caption>Caption</ChoiceField.Caption>
            </ChoiceFieldset.ChoiceField>
            <ChoiceFieldset.ChoiceField>
              <ChoiceField.Input value="labelTwo" />
              <ChoiceField.Label>Label two</ChoiceField.Label>
              <ChoiceField.Caption>Caption</ChoiceField.Caption>
            </ChoiceFieldset.ChoiceField>
          </ChoiceFieldset.List>
          <ChoiceFieldset.Validation>
            You made the right selections <a href="http://google.com">More Info</a>
          </ChoiceFieldset.Validation>
          <ChoiceFieldset.Caption>
            Hint: any selection is valid <a href="http://google.com">More Info</a>
          </ChoiceFieldset.Caption>
        </ChoiceFieldset>
      </SingleExampleContainer>
    </ExampleCollectionContainer>
  )
}

export const RadioFieldset = () => {
  return (
    <ExampleCollectionContainer>
      <SingleExampleContainer label="Default">
        <ChoiceFieldset validationStatus="success" name="radioFieldset">
          <ChoiceFieldset.Legend>Legend</ChoiceFieldset.Legend>
          <ChoiceFieldset.List>
            <ChoiceFieldset.ChoiceField>
              <ChoiceField.Input value="labelOne" />
              <ChoiceField.Label>Label one</ChoiceField.Label>
              <ChoiceField.Caption>Caption</ChoiceField.Caption>
            </ChoiceFieldset.ChoiceField>
            <ChoiceFieldset.ChoiceField>
              <ChoiceField.Input value="labelTwo" />
              <ChoiceField.Label>Label two</ChoiceField.Label>
              <ChoiceField.Caption>Caption</ChoiceField.Caption>
            </ChoiceFieldset.ChoiceField>
          </ChoiceFieldset.List>
          <ChoiceFieldset.Validation>
            You made the right selections <a href="http://google.com">More Info</a>
          </ChoiceFieldset.Validation>
          <ChoiceFieldset.Caption>
            Hint: any selection is valid <a href="http://google.com">More Info</a>
          </ChoiceFieldset.Caption>
        </ChoiceFieldset>
      </SingleExampleContainer>
    </ExampleCollectionContainer>
  )
}

export const WithValidation = () => {
  const [showValidation, setShowValidation] = useState(false)
  const handleValidationToggle: ChangeEventHandler<HTMLInputElement> = e => {
    setShowValidation(e.currentTarget.checked)
  }

  return (
    <>
      <div>
        <input id="showValidationInput" type="checkbox" checked={showValidation} onChange={handleValidationToggle} />
        <label htmlFor="showValidationInput">Show validation</label>
      </div>
      <ExampleCollectionContainer>
        <SingleExampleContainer label="Error">
          <InputField id="errored-defaultInputField" validationStatus="error">
            <InputField.Label>Name</InputField.Label>
            <InputField.Input as={TextInput} block />
            {showValidation && (
              <InputField.Validation>
                Invalid name, try a different one. <a href="http://google.com">More Info</a>
              </InputField.Validation>
            )}
            <InputField.Caption>
              Hint: your first name. <a href="http://google.com">More Info</a>
            </InputField.Caption>
          </InputField>
        </SingleExampleContainer>
        <SingleExampleContainer label="Successs">
          <InputField id="success-defaultInputField" validationStatus="success">
            <InputField.Label>Name</InputField.Label>
            <InputField.Input as={TextInput} block />
            {showValidation && (
              <InputField.Validation>
                Wow, such a cool name. <a href="http://google.com">More Info</a>
              </InputField.Validation>
            )}
            <InputField.Caption>
              Hint: your first name. <a href="http://google.com">More Info</a>
            </InputField.Caption>
          </InputField>
        </SingleExampleContainer>
      </ExampleCollectionContainer>
    </>
  )
}
