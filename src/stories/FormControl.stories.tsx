import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, Checkbox, Radio, Select, TextInput, TextInputWithTokens, ThemeProvider} from '..'
import FormControl from '../FormControl'
import {ComponentProps} from '../utils/types'
import Autocomplete from '../Autocomplete'
import {MarkGithubIcon} from '@primer/octicons-react'

type FormControlArgs = Pick<ComponentProps<typeof FormControl>, 'required' | 'disabled'>
type FormControlLabelArgs = ComponentProps<typeof FormControl.Label> & {labelChildren?: React.ReactNode}
type FormControlCaptionArgs = ComponentProps<typeof FormControl.Label> & {captionChildren?: React.ReactNode}
type FormControlValidationMessageArgs = ComponentProps<typeof FormControl.Validation> & {
  validationChildren?: React.ReactNode
}
type Args = FormControlArgs & FormControlLabelArgs & FormControlCaptionArgs & FormControlValidationMessageArgs

const excludedControlKeys = ['id', 'sx', 'layout']

const validationControlKeys = ['variant', 'validationChildren']

export default {
  title: 'Forms/FormControl',
  component: FormControl,
  argTypes: {
    // FormControl
    required: {
      defaultValue: false
    },
    disabled: {
      defaultValue: false
    },

    // FormControl.Label
    labelChildren: {
      name: 'children',
      type: 'string',
      defaultValue: '',
      table: {
        category: 'FormControl.Label'
      }
    },
    visuallyHidden: {
      defaultValue: false,
      type: 'boolean',
      table: {
        category: 'FormControl.Label'
      }
    },

    // FormControl.Caption
    captionChildren: {
      name: 'children',
      type: 'string',
      defaultValue: '',
      table: {
        category: 'FormControl.Caption'
      }
    },

    // FormControl.Validation
    validationChildren: {
      name: 'children',
      type: 'string',
      defaultValue: '',
      table: {
        category: 'FormControl.Validation'
      }
    },
    variant: {
      defaultValue: 'error',
      control: {
        type: 'radio',
        options: ['error', 'success', 'warning']
      },
      table: {
        category: 'FormControl.Validation'
      }
    }
  },
  parameters: {controls: {exclude: excludedControlKeys}},
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ]
} as Meta

const getArgsByChildComponent = ({
  captionChildren,
  disabled,
  labelChildren,
  required,
  validationChildren,
  variant,
  visuallyHidden
}: Args) => ({
  parentArgs: {disabled, required},
  labelArgs: {visuallyHidden, children: labelChildren},
  captionArgs: {children: captionChildren},
  validationArgs: {children: validationChildren, variant}
})

export const TextInputStory = (args: Args) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getArgsByChildComponent(args)

  return (
    <FormControl {...parentArgs}>
      <FormControl.Label {...labelArgs} />
      <TextInput />
      {captionArgs.children && <FormControl.Caption {...captionArgs} />}
      {validationArgs.children && <FormControl.Validation {...validationArgs} />}
    </FormControl>
  )
}

TextInputStory.storyName = 'Text Input'
TextInputStory.args = {
  labelChildren: 'Name'
}

export const AutocompleteInput = (args: Args) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getArgsByChildComponent(args)

  return (
    <FormControl {...parentArgs}>
      <FormControl.Label {...labelArgs} />
      <Autocomplete>
        <Autocomplete.Input block />
        <Autocomplete.Overlay>
          <Autocomplete.Menu
            items={[
              {text: 'css', id: 0},
              {text: 'css-in-js', id: 1},
              {text: 'styled-system', id: 2},
              {text: 'javascript', id: 3},
              {text: 'typescript', id: 4},
              {text: 'react', id: 5},
              {text: 'design-systems', id: 6}
            ]}
            selectedItemIds={[]}
          />
        </Autocomplete.Overlay>
      </Autocomplete>
      {captionArgs.children && <FormControl.Caption {...captionArgs} />}
      {validationArgs.children && <FormControl.Validation {...validationArgs} />}
    </FormControl>
  )
}

AutocompleteInput.args = {
  labelChildren: 'Tags'
}

export const TextInputWithTokensStory = (args: Args) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getArgsByChildComponent(args)

  return (
    <FormControl {...parentArgs}>
      <FormControl.Label {...labelArgs} />
      <TextInputWithTokens
        tokens={[
          {text: 'css', id: 0},
          {text: 'css-in-js', id: 1},
          {text: 'styled-system', id: 2}
        ]}
        onTokenRemove={() => null}
      />
      {captionArgs.children && <FormControl.Caption {...captionArgs} />}
      {validationArgs.children && <FormControl.Validation {...validationArgs} />}
    </FormControl>
  )
}

TextInputWithTokensStory.storyName = 'TextInputWithTokens Input'
TextInputWithTokensStory.args = {
  labelChildren: 'Tags'
}

export const SelectInput = (args: Args) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getArgsByChildComponent(args)

  return (
    <FormControl {...parentArgs}>
      <FormControl.Label {...labelArgs} />
      <Select>
        <Select.Option value="figma">Figma</Select.Option>
        <Select.Option value="css">Primer CSS</Select.Option>
        <Select.Option value="prc">Primer React components</Select.Option>
        <Select.Option value="pvc">Primer ViewComponents</Select.Option>
      </Select>
      {captionArgs.children && <FormControl.Caption {...captionArgs} />}
      {validationArgs.children && <FormControl.Validation {...validationArgs} />}
    </FormControl>
  )
}

SelectInput.args = {
  labelChildren: 'Preferred Primer component interface'
}

export const CheckboxInput = (args: Args) => {
  const {parentArgs, labelArgs, captionArgs} = getArgsByChildComponent(args)

  return (
    <FormControl {...parentArgs}>
      <Checkbox />
      <FormControl.Label {...labelArgs} />
      {captionArgs.children && <FormControl.Caption {...captionArgs} />}
    </FormControl>
  )
}

CheckboxInput.parameters = {controls: {exclude: [...excludedControlKeys, ...validationControlKeys]}}
CheckboxInput.args = {
  labelChildren: 'Selectable choice'
}

export const RadioInput = (args: Args) => {
  const {parentArgs, labelArgs, captionArgs} = getArgsByChildComponent(args)

  return (
    <FormControl {...parentArgs}>
      <Radio name="radioInput" value="choice" />
      <FormControl.Label {...labelArgs} />
      {captionArgs.children && <FormControl.Caption {...captionArgs} />}
    </FormControl>
  )
}

RadioInput.parameters = {controls: {exclude: [...excludedControlKeys, ...validationControlKeys]}}
RadioInput.args = {
  labelChildren: 'Selectable choice'
}

export const WithLeadingVisual = (args: Args) => {
  const {parentArgs, labelArgs, captionArgs} = getArgsByChildComponent(args)

  return (
    <FormControl {...parentArgs}>
      <FormControl.Label {...labelArgs} />
      <FormControl.LeadingVisual>
        <MarkGithubIcon />
      </FormControl.LeadingVisual>
      <Checkbox />
      {captionArgs.children && <FormControl.Caption {...captionArgs} />}
    </FormControl>
  )
}

WithLeadingVisual.storyName = 'With LeadingVisual'
WithLeadingVisual.args = {
  labelChildren: 'Selectable choice'
}
WithLeadingVisual.parameters = {controls: {exclude: [...excludedControlKeys, ...validationControlKeys]}}

export const CustomInput = (args: Args) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getArgsByChildComponent(args)

  return (
    <FormControl {...parentArgs}>
      <FormControl.Label htmlFor="custom-input" {...labelArgs} />
      <input
        type="text"
        id="custom-input"
        aria-describedby="custom-input-caption custom-input-validation"
        disabled={parentArgs.disabled}
        required={parentArgs.required}
      />
      {captionArgs.children && <FormControl.Caption id="custom-input-caption" {...captionArgs} />}
      {validationArgs.children && <FormControl.Validation id="custom-input-validation" {...validationArgs} />}
    </FormControl>
  )
}

CustomInput.args = {
  labelChildren: 'Name',
  variant: 'error',
  validationChildren: 'Not a valid name'
}
