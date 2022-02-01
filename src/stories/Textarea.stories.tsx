import React, {ReactNode} from 'react'
import {Meta} from '@storybook/react'
import styled from 'styled-components'

import {BaseStyles, Box, Textarea, TextareaProps, ThemeProvider} from '..'

const StyledForm = styled.form`
  padding: 20px;
`

type LabelProps = {children: ReactNode; htmlFor: string}
const Label = ({children, htmlFor}: LabelProps) => (
  <Box as="label" htmlFor={htmlFor} sx={{fontWeight: 'bold', display: 'block', fontSize: 1}}>
    {children}
  </Box>
)

export default {
  title: 'Forms/Textarea',
  component: Textarea,
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
    validationStatus: {
      name: 'Validation Status',
      defaultValue: undefined,
      options: ['success', 'error', undefined],
      control: {type: 'radio'}
    },
    disabled: {
      name: 'Disabled',
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    }
  }
} as Meta

export const Default = (args: TextareaProps) => {
  return (
    <>
      <StyledForm>
        <Label htmlFor="textarea">Label</Label>
        <Textarea id="textarea" {...args} />
      </StyledForm>
    </>
  )
}

export const ValidationStates = (args: TextareaProps) => {
  return (
    <>
      <StyledForm>
        <Label htmlFor="textarea-success">Success</Label>
        <Textarea id="textarea-success" validationStatus="success" {...args} />
      </StyledForm>
      <StyledForm>
        <Label htmlFor="textarea-error">Error</Label>
        <Textarea id="textarea-error" validationStatus="error" {...args} />
      </StyledForm>
    </>
  )
}

export const Inactive = (args: TextareaProps) => {
  return (
    <>
      <StyledForm>
        <Label htmlFor="textarea-inactive">Inactive</Label>
        <Textarea id="textarea-inactive" {...args} disabled />
      </StyledForm>
    </>
  )
}
