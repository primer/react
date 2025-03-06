import React from 'react'
import type {Meta} from '@storybook/react'
import {Box, FormControl} from '..'
import TextInput from '.'
import {textInputExcludedControlKeys} from '../utils/story-helpers'
import {FeatureFlags} from '../FeatureFlags'

export default {
  title: 'Components/TextInput/Dev',
  component: TextInput,
  parameters: {controls: {exclude: textInputExcludedControlKeys}},
} as Meta<React.ComponentProps<typeof TextInput>>

export const WithCSS = () => (
  <FeatureFlags
    flags={{
      primer_react_css_modules_staff: true,
      primer_react_css_modules_ga: true,
    }}
  >
    <Box as="form">
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <TextInput className="testCustomClassnameBorderColor" />
      </FormControl>
    </Box>
  </FeatureFlags>
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
  <FeatureFlags
    flags={{
      primer_react_css_modules_staff: true,
      primer_react_css_modules_ga: true,
    }}
  >
    <Box as="form">
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <TextInput sx={{borderColor: 'red'}} className="testCustomClassnameBorderColor" />
      </FormControl>
    </Box>
  </FeatureFlags>
)
