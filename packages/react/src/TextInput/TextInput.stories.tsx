/* eslint-disable primer-react/spread-props-first */
import type React from 'react'
import {useState} from 'react'
import type {Meta} from '@storybook/react-vite'
import {FormControl} from '..'
import type {TextInputProps} from '../TextInput'
import TextInput from '../TextInput'
import type {FormControlArgs} from '../utils/story-helpers'
import {
  formControlArgs,
  formControlArgTypes,
  getFormControlArgsByChildComponent,
  getTextInputArgTypes,
  textInputExcludedControlKeys,
} from '../utils/story-helpers'
import classes from './TextInput.stories.module.css'

export default {
  title: 'Components/TextInput',
  component: TextInput,
  parameters: {controls: {exclude: textInputExcludedControlKeys}},
} as Meta

export const Playground = (args: FormControlArgs<TextInputProps>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  const [value, setValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <form className={classes.Container}>
      <FormControl {...parentArgs}>
        <FormControl.Label {...labelArgs} />
        <TextInput value={value} onChange={handleChange} {...args} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </form>
  )
}
Playground.args = {
  ...formControlArgs,
  type: 'text',
  onChange: () => {},
}
Playground.argTypes = {
  type: {
    control: {
      type: 'text',
    },
  },
  ...getTextInputArgTypes(),
  ...formControlArgTypes,
}

export const Default = () => (
  <form>
    <FormControl>
      <FormControl.Label>Default label</FormControl.Label>
      <TextInput />
    </FormControl>
  </form>
)
