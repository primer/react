import type React from 'react'
import type {Meta} from '@storybook/react-vite'
import {FormControl} from '..'
import TextInput from '.'
import {textInputExcludedControlKeys} from '../utils/story-helpers'
import classes from './TextInput.dev.stories.module.css'

export default {
  title: 'Components/TextInput/Dev',
  component: TextInput,
  parameters: {controls: {exclude: textInputExcludedControlKeys}},
} as Meta<React.ComponentProps<typeof TextInput>>

export const WithCSS = () => (
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput className={classes.CustomBorderColor} />
    </FormControl>
  </form>
)
