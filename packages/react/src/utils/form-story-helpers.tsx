import type React from 'react'
import type {CheckboxGroup, FormControl} from '../index'
import type {ComponentProps} from './types'
import type {ArgTypes} from '@storybook/react'
import type {InputType} from 'storybook/internal/csf'

type CheckboxOrRadioGroupWrapperArgs = ComponentProps<typeof CheckboxGroup>
type CheckboxOrRadioGroupLabelArgs = ComponentProps<typeof CheckboxGroup.Label> & {
  labelChildren?: React.ReactNode
}
type CheckboxOrRadioGroupCaptionArgs = ComponentProps<typeof CheckboxGroup.Caption> & {
  captionChildren?: React.ReactNode
}
type CheckboxOrRadioGroupValidationMessageArgs = ComponentProps<typeof CheckboxGroup.Validation> & {
  validationChildren?: React.ReactNode
}
export type CheckboxOrRadioGroupArgs = CheckboxOrRadioGroupWrapperArgs &
  CheckboxOrRadioGroupLabelArgs &
  CheckboxOrRadioGroupCaptionArgs &
  CheckboxOrRadioGroupValidationMessageArgs

type FormControlParentArgs = Pick<ComponentProps<typeof FormControl>, 'required' | 'disabled'>
type FormControlLabelArgs = Omit<ComponentProps<typeof FormControl.Label>, 'as'> & {labelChildren?: React.ReactNode}
type FormControlCaptionArgs = ComponentProps<typeof FormControl.Caption> & {captionChildren?: React.ReactNode}
type FormControlValidationMessageArgs = ComponentProps<typeof FormControl.Validation> & {
  validationChildren?: React.ReactNode
}
export type FormControlArgs<TInputProps = unknown> = FormControlParentArgs &
  FormControlLabelArgs &
  FormControlCaptionArgs &
  Partial<FormControlValidationMessageArgs> & // partial because we don't pass use validation for checkbox or radio
  TInputProps

export const inputWrapperArgTypes: ArgTypes = {
  block: {
    defaultValue: false,
    control: {
      type: 'boolean',
    },
  },
  contrast: {
    defaultValue: false,
    control: {
      type: 'boolean',
    },
  },
  disabled: {
    defaultValue: false,
    control: {
      type: 'boolean',
    },
  },
  placeholder: {
    defaultValue: '',
    control: {
      type: 'text',
    },
  },
  size: {
    name: 'size (input)', // TODO: remove '(input)'
    defaultValue: 'medium',
    options: ['small', 'medium', 'large'],
    control: {type: 'radio'},
  },
  validationStatus: {
    defaultValue: undefined,
    options: ['error', 'success', undefined],
    control: {type: 'radio'},
  },
}

const textInputArgTypesUnsorted: ArgTypes = {
  ...inputWrapperArgTypes,
  loading: {
    defaultValue: false,
    control: {
      type: 'boolean',
    },
  },
  loaderPosition: {
    defaultValue: 'auto',
    options: ['auto', 'leading', 'trailing'],
    control: {
      type: 'radio',
    },
  },
  monospace: {
    defaultValue: false,
    control: {
      type: 'boolean',
    },
  },
}

// Alphabetize and optionally categorize the props
export const getTextInputArgTypes = (category?: string) =>
  Object.keys(textInputArgTypesUnsorted)
    .sort()
    .reduce<Record<string, unknown>>((obj, key) => {
      obj[key] = category
        ? {
            // have to do weird type casting so we can spread the object
            ...(textInputArgTypesUnsorted[key] as {[key: string]: unknown}),
            table: {
              category,
            },
          }
        : textInputArgTypesUnsorted[key]
      return obj
    }, {})

export const textInputExcludedControlKeys = ['as', 'icon', 'leadingVisual', 'sx', 'trailingVisual', 'trailingAction']

export const textInputWithTokensArgTypes: ArgTypes = {
  hideTokenRemoveButtons: {
    defaultValue: false,
    type: 'boolean',
    table: {
      category: 'TextInputWithTokens props',
    },
  },
  maxHeight: {
    type: 'string',
    defaultValue: 'none',
    description: 'Any valid value for the CSS max-height property',
    table: {
      category: 'TextInputWithTokens props',
    },
  },
  preventTokenWrapping: {
    defaultValue: false,
    type: 'boolean',
    table: {
      category: 'TextInputWithTokens props',
    },
  },
  size: {
    name: 'size (token size)',
    defaultValue: 'xlarge',
    options: ['small', 'medium', 'large', 'xlarge'],
    control: {
      type: 'radio',
    },
    table: {
      category: 'TextInputWithTokens props',
    },
  },
  visibleTokenCount: {
    defaultValue: 999,
    type: 'number',
    table: {
      category: 'TextInputWithTokens props',
    },
  },
}

export const formControlArgs = {
  required: false,
  disabled: false,
  labelChildren: 'Label',
  visuallyHidden: false,
  captionChildren: '',
  validationChildren: '',
  variant: 'error',
}

export const formControlArgTypes: ArgTypes = {
  // FormControl
  required: {
    control: {
      type: 'boolean',
    },
    table: {
      category: 'FormControl',
    },
  },
  disabled: {
    control: {
      type: 'boolean',
    },
    table: {
      category: 'FormControl',
    },
  },

  // FormControl.Label
  labelChildren: {
    name: 'children',
    type: 'string',
    table: {
      category: 'FormControl.Label',
    },
  },
  visuallyHidden: {
    type: 'boolean',
    table: {
      category: 'FormControl.Label',
    },
  },

  // FormControl.Caption
  captionChildren: {
    name: 'children',
    type: 'string',
    table: {
      category: 'FormControl.Caption',
    },
  },

  // FormControl.Validation
  validationChildren: {
    name: 'children',
    type: 'string',
    table: {
      category: 'FormControl.Validation',
    },
  },
  variant: {
    control: {
      type: 'radio',
    },
    options: ['error', 'success'],
    table: {
      category: 'FormControl.Validation',
    },
  },
}

const formControlArgTypeKeys = Object.keys(formControlArgTypes) as Array<keyof typeof formControlArgTypes>

export const formControlArgTypesWithoutValidation = formControlArgTypeKeys.reduce<
  Partial<Record<keyof typeof formControlArgTypes, InputType>>
>((acc, key) => {
  if (formControlArgTypes[key].table?.category !== 'FormControl.Validation') {
    acc[key] = formControlArgTypes[key]
  }
  return acc
}, {})

export const getFormControlArgsByChildComponent = ({
  captionChildren,
  disabled,
  labelChildren,
  required,
  validationChildren,
  variant,
  visuallyHidden,
}: FormControlArgs) => ({
  parentArgs: {disabled, required},
  labelArgs: {visuallyHidden, children: labelChildren},
  captionArgs: {children: captionChildren},
  validationArgs: {children: validationChildren, variant},
})
