import React from 'react'
import {Box, ThemeProvider, theme, themeGet, BaseStyles, CheckboxGroup, FormControl} from '../index'
import {createGlobalStyle} from 'styled-components'
import {ComponentProps} from './types'
import {ArgTypes} from '@storybook/react'
import {InputType} from '@storybook/csf'
import {Icon} from '@primer/octicons-react'

// we don't import StoryContext from storybook because of exports that conflict
// with primer/react more: https://github.com/primer/react/runs/6129115026?check_suite_focus=true
type StoryContext = Record<string, unknown> & {globals: {colorScheme: string}; parameters: Record<string, unknown>}

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
type FormControlLabelArgs = ComponentProps<typeof FormControl.Label> & {labelChildren?: React.ReactNode}
type FormControlCaptionArgs = ComponentProps<typeof FormControl.Caption> & {captionChildren?: React.ReactNode}
type FormControlValidationMessageArgs = ComponentProps<typeof FormControl.Validation> & {
  validationChildren?: React.ReactNode
}
export type FormControlArgs<TInputProps = unknown> = FormControlParentArgs &
  FormControlLabelArgs &
  FormControlCaptionArgs &
  Partial<FormControlValidationMessageArgs> & // partial because we don't pass use validation for checkbox or radio
  TInputProps

// set global theme styles for each story
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${themeGet('colors.canvas.default')};
    color: ${themeGet('colors.fg.default')};
  }
`

// only remove padding for multi-theme view grid
const GlobalStyleMultiTheme = createGlobalStyle`
  body {
    padding: 0 !important;
  }
`

export const withThemeProvider = (Story: React.FC<React.PropsWithChildren<StoryContext>>, context: StoryContext) => {
  // used for testing ThemeProvider.stories.tsx
  if (context.parameters.disableThemeDecorator) return Story(context)

  const {colorScheme} = context.globals

  if (colorScheme === 'all') {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))',
          height: '100vh'
        }}
      >
        <GlobalStyleMultiTheme />
        {Object.keys(theme.colorSchemes).map(scheme => (
          <ThemeProvider key={scheme} colorMode="day" dayScheme={scheme}>
            <BaseStyles>
              <Box
                sx={{
                  padding: '1rem',
                  height: '100%',
                  backgroundColor: 'canvas.default',
                  color: 'fg.default'
                }}
              >
                <div id={`html-addon-root-${scheme}`}>{Story(context)}</div>
              </Box>
            </BaseStyles>
          </ThemeProvider>
        ))}
      </Box>
    )
  }

  return (
    <ThemeProvider colorMode="day" dayScheme={colorScheme}>
      <GlobalStyle />
      <BaseStyles>
        <div id="html-addon-root">{Story(context)}</div>
      </BaseStyles>
    </ThemeProvider>
  )
}

export const toolbarTypes = {
  colorScheme: {
    name: 'Color scheme',
    description: 'Switch color scheme',
    defaultValue: 'light',
    toolbar: {
      icon: 'photo',
      items: [...Object.keys(theme.colorSchemes), 'all'],
      title: 'Color scheme'
    }
  }
}

export const inputWrapperArgTypes: ArgTypes = {
  block: {
    defaultValue: false,
    control: {
      type: 'boolean'
    }
  },
  contrast: {
    defaultValue: false,
    control: {
      type: 'boolean'
    }
  },
  disabled: {
    defaultValue: false,
    control: {
      type: 'boolean'
    }
  },
  placeholder: {
    defaultValue: '',
    control: {
      type: 'text'
    }
  },
  size: {
    name: 'size (input)', // TODO: remove '(input)'
    defaultValue: 'medium',
    options: ['small', 'medium', 'large'],
    control: {type: 'radio'}
  },
  validationStatus: {
    defaultValue: undefined,
    options: ['error', 'success', 'warning', undefined],
    control: {type: 'radio'}
  }
}

const textInputArgTypesUnsorted: ArgTypes = {
  ...inputWrapperArgTypes,
  loading: {
    defaultValue: false,
    control: {
      type: 'boolean'
    }
  },
  loaderPosition: {
    defaultValue: 'auto',
    options: ['auto', 'leading', 'trailing'],
    control: {
      type: 'radio'
    }
  },
  monospace: {
    defaultValue: false,
    control: {
      type: 'boolean'
    }
  }
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
              category
            }
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
      category: 'TextInputWithTokens props'
    }
  },
  maxHeight: {
    type: 'string',
    defaultValue: 'none',
    description: 'Any valid value for the CSS max-height property',
    table: {
      category: 'TextInputWithTokens props'
    }
  },
  preventTokenWrapping: {
    defaultValue: false,
    type: 'boolean',
    table: {
      category: 'TextInputWithTokens props'
    }
  },
  size: {
    name: 'size (token size)',
    defaultValue: 'xlarge',
    options: ['small', 'medium', 'large', 'xlarge'],
    control: {
      type: 'radio'
    },
    table: {
      category: 'TextInputWithTokens props'
    }
  },
  visibleTokenCount: {
    defaultValue: 999,
    type: 'number',
    table: {
      category: 'TextInputWithTokens props'
    }
  }
}

export const formControlArgs = {
  required: false,
  disabled: false,
  labelChildren: 'Label',
  visuallyHidden: false,
  captionChildren: '',
  validationChildren: '',
  variant: 'error'
}

export const formControlArgTypes: ArgTypes = {
  // FormControl
  required: {
    control: {
      type: 'boolean'
    },
    table: {
      category: 'FormControl'
    }
  },
  disabled: {
    control: {
      type: 'boolean'
    },
    table: {
      category: 'FormControl'
    }
  },

  // FormControl.Label
  labelChildren: {
    name: 'children',
    type: 'string',
    table: {
      category: 'FormControl.Label'
    }
  },
  visuallyHidden: {
    type: 'boolean',
    table: {
      category: 'FormControl.Label'
    }
  },

  // FormControl.Caption
  captionChildren: {
    name: 'children',
    type: 'string',
    table: {
      category: 'FormControl.Caption'
    }
  },

  // FormControl.Validation
  validationChildren: {
    name: 'children',
    type: 'string',
    table: {
      category: 'FormControl.Validation'
    }
  },
  variant: {
    control: {
      type: 'radio'
    },
    options: ['error', 'success', 'warning'],
    table: {
      category: 'FormControl.Validation'
    }
  }
}

const formControlArgTypeKeys = Object.keys(formControlArgTypes) as Array<keyof typeof formControlArgTypes>

export const formControlArgTypesWithoutValidation = formControlArgTypeKeys.reduce<
  Partial<Record<keyof typeof formControlArgTypes, InputType>>
>((acc, key) => {
  if (formControlArgTypes[key].table.category !== 'FormControl.Validation') {
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
  visuallyHidden
}: FormControlArgs) => ({
  parentArgs: {disabled, required},
  labelArgs: {visuallyHidden, children: labelChildren},
  captionArgs: {children: captionChildren},
  validationArgs: {children: validationChildren, variant}
})

// Use this function for icon options in the controls. Desired icons are passed in as an array of Octicons
export const OcticonArgType = (iconList: Icon[]) => {
  const icons = iconList.reduce<Record<string, Icon>>((obj, icon) => {
    obj[icon.displayName || 'Icon'] = icon
    return obj
  }, {})

  return {
    options: Object.keys(icons),
    control: {
      type: 'select'
    },
    mapping: icons
  }
}
