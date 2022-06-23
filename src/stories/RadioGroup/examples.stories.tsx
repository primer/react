import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles, RadioGroup, FormControl, ThemeProvider} from '../../'
import {CheckboxOrRadioGroupArgs} from '../../utils/story-helpers'
import Radio from '../../Radio'

export default {
  title: 'Forms/RadioGroup/examples',
  component: RadioGroup,
  argTypes: {
    // RadioGroup
    disabled: {
      defaultValue: false,
      type: 'boolean'
    },
    required: {
      defaultValue: false,
      type: 'boolean'
    },

    // RadioGroup.Label
    labelChildren: {
      defaultValue: 'Choices',
      type: 'string',
      table: {
        category: 'RadioGroup.Label'
      }
    },
    visuallyHidden: {
      defaultValue: false,
      type: 'boolean',
      table: {
        category: 'RadioGroup.Label'
      }
    },

    // RadioGroup.Caption
    captionChildren: {
      defaultValue: '',
      type: 'string',
      table: {
        category: 'RadioGroup.Caption'
      }
    },

    // RadioGroup.Validation
    validationChildren: {
      defaultValue: '',
      type: 'string',
      table: {
        category: 'RadioGroup.Validation'
      }
    },
    variant: {
      defaultValue: 'error',
      control: {
        type: 'radio',
        options: ['error', 'success', 'warning']
      },
      table: {
        category: 'RadioGroup.Validation'
      }
    }
  },
  parameters: {controls: {exclude: ['aria-labelledby', 'id', 'onChange', 'sx', 'name']}},
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

export const Default = ({
  disabled,
  required,
  labelChildren,
  visuallyHidden,
  captionChildren,
  validationChildren,
  variant
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
        <Radio value="two" />
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
