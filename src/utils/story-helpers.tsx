import React from 'react'
import {Box, ThemeProvider, theme, themeGet, BaseStyles, CheckboxGroup} from '../index'
import {createGlobalStyle} from 'styled-components'
import {ComponentProps} from './types'

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

export const withThemeProvider = (Story: React.FC<StoryContext>, context: StoryContext) => {
  // used for testing ThemeProvider.stories.tsx
  if (context.parameters.disableThemeDecorator) return <Story {...context} />

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
                <div id={`html-addon-root-${scheme}`}>
                  <Story {...context} />
                </div>
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
        <div id="html-addon-root">
          <Story {...context} />
        </div>
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
      showName: true
    }
  }
}

export const inputWrapperArgTypes: Record<string, unknown> = {
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
  inputSize: {
    name: 'size',
    defaultValue: 'medium',
    options: ['small', 'medium', 'large'],
    control: {type: 'radio'}
  },
  validationStatus: {
    options: ['warning', 'error', 'success'],
    control: {type: 'radio'}
  }
}

const textInputArgTypesUnsorted: Record<string, unknown> = {
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

export const textInputExcludedControlKeys = [
  'as',
  'icon',
  'leadingVisual',
  'sx',
  'trailingVisual',
  'trailingAction',
  'variant'
]

export const textInputWithTokensArgTypes = {
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
