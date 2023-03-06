import React from 'react'
import {MarkGithubIcon} from '@primer/octicons-react'
import {Box, FormControl, Radio} from '..'

export default {
  title: 'Components/Radio/Features',
  component: Radio,
}

export const WithLeadingVisual = () => {
  return (
    <Box as="form">
      <FormControl>
        <FormControl.LeadingVisual>
          <MarkGithubIcon />
        </FormControl.LeadingVisual>
        <Radio value="default" name="default-radio-name" />
        <FormControl.Label>Default label</FormControl.Label>
      </FormControl>
    </Box>
  )
}

export const Disabled = () => {
  return (
    <Box as="form">
      <FormControl disabled>
        <Radio value="default" name="default-radio-name" />
        <FormControl.Label>Default label</FormControl.Label>
      </FormControl>
    </Box>
  )
}

export const WithCaption = () => {
  return (
    <Box as="form">
      <FormControl>
        <Radio value="default" name="default-radio-name" />
        <FormControl.Label>Default label</FormControl.Label>
        <FormControl.Caption>This is a caption</FormControl.Caption>
      </FormControl>
    </Box>
  )
}
