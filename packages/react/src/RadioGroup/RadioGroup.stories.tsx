import type {Meta} from '@storybook/react-vite'
import {Radio, RadioGroup, FormControl} from '..'
import type {CheckboxOrRadioGroupArgs} from '../utils/form-story-helpers'

export default {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: {controls: {exclude: ['aria-labelledby', 'id', 'onChange', 'sx']}},
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
    <RadioGroup {...parentArgs} name="defaultRadioGroup">
      {labelArgs.children && <RadioGroup.Label {...labelArgs} />}
      {captionChildren && <RadioGroup.Caption>{captionChildren}</RadioGroup.Caption>}
      <FormControl>
        <Radio value="one" />
        <FormControl.Label>Choice one</FormControl.Label>
      </FormControl>
      <FormControl>
        <Radio value="two" defaultChecked />
        <FormControl.Label>Choice two</FormControl.Label>
      </FormControl>
      <FormControl>
        <Radio value="three" />
        <FormControl.Label>Choice three</FormControl.Label>
      </FormControl>
      {validationArgs.children && <RadioGroup.Validation {...validationArgs} />}
    </RadioGroup>
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
  <RadioGroup name="defaultRadioGroup">
    <RadioGroup.Label>Choices</RadioGroup.Label>
    <FormControl>
      <Radio value="one" />
      <FormControl.Label>Choice one</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio value="two" defaultChecked />
      <FormControl.Label>Choice two</FormControl.Label>
    </FormControl>
    <FormControl>
      <Radio value="three" />
      <FormControl.Label>Choice three</FormControl.Label>
    </FormControl>
  </RadioGroup>
)
