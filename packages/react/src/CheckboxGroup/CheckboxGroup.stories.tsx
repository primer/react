import type {Meta} from '@storybook/react-vite'
import {Checkbox, CheckboxGroup, FormControl} from '..'
import type {CheckboxOrRadioGroupArgs} from '../utils/form-story-helpers'

export default {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
  parameters: {controls: {exclude: ['aria-labelledby', 'id', 'onChange']}},
} as Meta

export const Playground = ({
  disabled,
  required,
  labelChildren = 'Choices',
  visuallyHidden,
  captionChildren,
  validationChildren,
  variant,
}: CheckboxOrRadioGroupArgs) => {
  const parentArgs = {disabled, required}
  const labelArgs = {children: labelChildren, visuallyHidden}
  const validationArgs = {children: validationChildren, variant}

  return (
    <CheckboxGroup {...parentArgs}>
      {labelArgs.children && <CheckboxGroup.Label {...labelArgs} />}
      {captionChildren && <CheckboxGroup.Caption>{captionChildren}</CheckboxGroup.Caption>}
      <FormControl>
        <Checkbox value="one" defaultChecked />
        <FormControl.Label>Choice one</FormControl.Label>
      </FormControl>
      <FormControl>
        <Checkbox value="two" defaultChecked />
        <FormControl.Label>Choice two</FormControl.Label>
      </FormControl>
      <FormControl>
        <Checkbox value="three" />
        <FormControl.Label>Choice three</FormControl.Label>
      </FormControl>
      {validationArgs.children && <CheckboxGroup.Validation {...validationArgs} />}
    </CheckboxGroup>
  )
}
Playground.args = {
  disabled: false,
  required: false,
  labelChildren: 'Choices',
  visuallyHidden: false,
  captionChildren: '',
  validationChildren: '',
  variant: 'error',
}
Playground.argTypes = {
  // CheckboxGroup
  disabled: {
    type: 'boolean',
  },
  required: {
    type: 'boolean',
  },
  // CheckboxGroup.Label
  labelChildren: {
    type: 'string',
    table: {
      category: 'CheckboxGroup.Label',
    },
  },
  visuallyHidden: {
    type: 'boolean',
    table: {
      category: 'CheckboxGroup.Label',
    },
  },
  // CheckboxGroup.Caption
  captionChildren: {
    type: 'string',
    table: {
      category: 'CheckboxGroup.Caption',
    },
  },
  // CheckboxGroup.Validation
  validationChildren: {
    type: 'string',
    table: {
      category: 'CheckboxGroup.Validation',
    },
  },
  variant: {
    control: {
      type: 'radio',
    },
    options: ['error', 'success'],
    table: {
      category: 'CheckboxGroup.Validation',
    },
  },
}

export const Default = () => (
  <CheckboxGroup>
    <CheckboxGroup.Label>Choices</CheckboxGroup.Label>
    <FormControl required>
      <Checkbox value="one" defaultChecked />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox value="two" defaultChecked />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox value="three" />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
  </CheckboxGroup>
)
