import React from 'react'
import {Box, FormControl} from '..'
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
    <FormControl>
      <FormControl.Label visuallyHidden>Default label</FormControl.Label>
      <Textarea />
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
