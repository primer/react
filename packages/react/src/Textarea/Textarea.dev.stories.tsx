import React from 'react'
import type {Meta} from '@storybook/react'
import {Box, FormControl, Textarea} from '..'

export default {
  title: 'Components/Textarea/Dev',
  component: Textarea,
} as Meta

export const Default = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <Textarea sx={{color: 'red'}} style={{border: '1px solid blue'}} value="foo" />
    </FormControl>
  </Box>
)
