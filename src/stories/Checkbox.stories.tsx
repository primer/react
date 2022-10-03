import React, {useRef, useState} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, Checkbox, CheckboxProps, ThemeProvider} from '..'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import {action} from '@storybook/addon-actions'
import FormControl from '../FormControl'
import {
  FormControlArgs,
  formControlArgTypesWithoutValidation,
  getFormControlArgsByChildComponent
} from '../utils/story-helpers'
import {MarkGithubIcon} from '@primer/octicons-react'

const excludedControlKeys = ['required', 'value', 'validationStatus', 'sx']

export default {
  title: 'Components/Forms/Checkbox',
  component: Checkbox,
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Box paddingTop={5}>{Story()}</Box>
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ],
  parameters: {controls: {exclude: excludedControlKeys}},
  args: {
    checked: false,
    indeterminate: false
  },
  argTypes: {
    checked: {
      control: {
        type: 'boolean'
      }
    },
    indeterminate: {
      control: {
        type: 'boolean'
      }
    },
    ...formControlArgTypesWithoutValidation
  }
} as Meta

export const Default = ({value: _value, checked, ...args}: FormControlArgs<CheckboxProps>) => {
  const {parentArgs, labelArgs, captionArgs} = getFormControlArgsByChildComponent(args)

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <Checkbox value="default" checked={checked} {...args} />
        <FormControl.Label {...labelArgs} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
      </FormControl>
    </Box>
  )
}
Default.args = {
  labelChildren: 'Default checkbox',
  captionChildren: 'Always unchecked unless `checked` is set to true in Storybook controls'
}

export const WithLeadingVisual = ({value: _value, checked, ...args}: FormControlArgs<CheckboxProps>) => {
  const {parentArgs, labelArgs, captionArgs} = getFormControlArgsByChildComponent(args)

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.LeadingVisual>
          <MarkGithubIcon />
        </FormControl.LeadingVisual>
        <Checkbox value="default" checked={checked} {...args} />
        <FormControl.Label {...labelArgs} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
      </FormControl>
    </Box>
  )
}
WithLeadingVisual.args = {
  labelChildren: 'Default checkbox',
  captionChildren: 'Always unchecked unless `checked` is set to true in Storybook controls'
}

export const Controlled = (args: FormControlArgs<CheckboxProps>) => {
  const {parentArgs, labelArgs, captionArgs} = getFormControlArgsByChildComponent(args)
  const [isChecked, setChecked] = useState<boolean>(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    action('Change event triggered')
  }

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <Checkbox value="default" onChange={handleChange} checked={isChecked} {...args} />
        <FormControl.Label {...labelArgs} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
      </FormControl>
    </Box>
  )
}
Controlled.parameters = {controls: {exclude: [...excludedControlKeys, 'checked']}}
Controlled.args = {
  labelChildren: 'Controlled checkbox',
  captionChildren: 'Checked attribute is controlled by React state update on change'
}

export const Uncontrolled = (args: FormControlArgs<CheckboxProps>) => {
  const {parentArgs, labelArgs, captionArgs} = getFormControlArgsByChildComponent(args)
  const checkboxRef = useRef<HTMLInputElement | null>(null)

  useLayoutEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = false
    }
  }, [])

  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <Checkbox ref={checkboxRef} {...args} />
        <FormControl.Label {...labelArgs} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
      </FormControl>
    </Box>
  )
}
Uncontrolled.parameters = {controls: {exclude: [...excludedControlKeys, 'checked']}}
Uncontrolled.args = {
  labelChildren: 'Uncontrolled checkbox',
  captionChildren: 'Checked attribute is set in a useLayoutEffect hook'
}
