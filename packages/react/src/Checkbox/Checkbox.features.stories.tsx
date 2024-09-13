import React from 'react'
import {Box, Checkbox} from '..'
import FormControl from '../FormControl'
import {MarkGithubIcon} from '@primer/octicons-react'

export default {
  title: 'Components/Checkbox/Features',
}

export const WithLeadingVisual = () => {
  return (
    <Box as="form">
      <FormControl>
        <FormControl.LeadingVisual>
          <MarkGithubIcon />
        </FormControl.LeadingVisual>
        <Checkbox value="default" />
        <FormControl.Label>Default label</FormControl.Label>
      </FormControl>
    </Box>
  )
}

export const Disabled = () => {
  return (
    <Box as="form">
      <FormControl disabled>
        <Checkbox value="default" />
        <FormControl.Label>Default label</FormControl.Label>
      </FormControl>
    </Box>
  )
}

export const WithCaption = () => {
  return (
    <Box as="form">
      <FormControl>
        <Checkbox value="default" />
        <FormControl.Label>Default label</FormControl.Label>
        <FormControl.Caption>This is a caption</FormControl.Caption>
      </FormControl>
    </Box>
  )
}

export const Indeterminate = () => (
  <Box as="form">
    <FormControl>
      <Checkbox value="default" indeterminate />
      <FormControl.Label>Default label</FormControl.Label>
    </FormControl>
  </Box>
)
