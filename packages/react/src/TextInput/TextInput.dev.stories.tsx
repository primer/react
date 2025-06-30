import type React from 'react'
import type {Meta} from '@storybook/react-vite'
import {Box, FormControl} from '..'
import TextInput from '.'
import {textInputExcludedControlKeys} from '../utils/story-helpers'

export default {
  title: 'Components/TextInput/Dev',
  component: TextInput,
  parameters: {controls: {exclude: textInputExcludedControlKeys}},
} as Meta<React.ComponentProps<typeof TextInput>>

export const WithCSS = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput className="testCustomClassnameBorderColor" />
    </FormControl>
  </Box>
)

export const WithSx = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput sx={{borderColor: 'red'}} />
    </FormControl>
  </Box>
)

export const WithSxAndCSS = () => (
  <Box as="form">
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput sx={{borderColor: 'red'}} className="testCustomClassnameBorderColor" />
    </FormControl>
  </Box>
)
