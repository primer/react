import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, Box, FormControl, Radio, RadioProps, ThemeProvider} from '..'
import {
  FormControlArgs,
  formControlArgTypesWithoutValidation,
  getFormControlArgsByChildComponent
} from '../utils/story-helpers'

const excludedControlKeys = ['required', 'value', 'name', 'validationStatus', 'sx']

export default {
  title: 'Components/Forms/Radio',
  component: Radio,
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Box sx={{pt: 3}}>{Story()}</Box>
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ],
  parameters: {controls: {exclude: excludedControlKeys}},
  argTypes: {
    checked: {
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    },
    ...formControlArgTypesWithoutValidation
  }
} as Meta

export const Default = ({value: _value, ...args}: FormControlArgs<RadioProps>) => {
  const {parentArgs, labelArgs, captionArgs} = getFormControlArgsByChildComponent(args)

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <Radio name="default-radio-name" value="default" {...args} />
        <FormControl.Label {...labelArgs} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
      </FormControl>
    </Box>
  )
}
Default.args = {
  labelChildren: 'Default radio button'
}
