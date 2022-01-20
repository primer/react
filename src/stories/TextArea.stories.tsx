import React, {ReactNode} from 'react'
import {Meta} from '@storybook/react'
import styled from 'styled-components'

import {BaseStyles, Box, TextArea, TextAreaProps, Text, ThemeProvider} from '..'
import {action} from '@storybook/addon-actions'
import {get} from '../constants'

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
  title: 'Forms/TextArea',
  component: TextArea,
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

export const Default = (args: TextAreaProps) => {
  return (
    <>
      <StyledForm>
        <Label htmlFor="textarea">Label</Label>
        <TextArea id="textarea" {...args} />
      </StyledForm>
    </>
  )
}

export const ValidationStates = (args: TextAreaProps) => {
  return (
    <>
      <StyledForm>
        <Label htmlFor="textarea-success">Success</Label>
        <TextArea id="textarea-success" validationStatus="success" {...args} />
      </StyledForm>
      <StyledForm>
        <Label htmlFor="textarea-error">Error</Label>
        <TextArea id="textarea-error" validationStatus="error" {...args} />
      </StyledForm>
    </>
  )
}

export const Inactive = (args: TextAreaProps) => {
  return (
    <>
      <StyledForm>
        <Label htmlFor="textarea-inactive">Inactive</Label>
        <TextArea id="textarea-inactive" disabled {...args} />
      </StyledForm>
    </>
  )
}
