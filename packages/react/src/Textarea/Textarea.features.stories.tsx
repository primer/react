import React from 'react'
import {Box, FormControl, Heading} from '..'
import Textarea from '../Textarea'

export default {
  title: 'Components/Textarea/Features',
}

export const Disabled = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea disabled />
    </FormControl>
  </Box>
)

export const WithCaption = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <FormControl.Caption>This is a caption</FormControl.Caption>
      <Textarea />
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
      <Textarea />
      <FormControl.Caption>Label is visually hidden; the title describes the purpose visually</FormControl.Caption>
    </FormControl>
  </Box>
)

export const Error = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea />
      <FormControl.Validation variant="error">Something went wrong</FormControl.Validation>
    </FormControl>
  </Box>
)

export const Success = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea />
      <FormControl.Validation variant="success">Success</FormControl.Validation>
    </FormControl>
  </Box>
)

export const Block = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea block />
    </FormControl>
  </Box>
)
