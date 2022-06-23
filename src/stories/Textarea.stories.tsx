import React from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, FormControl, Textarea, TextareaProps, ThemeProvider} from '..'
import {DEFAULT_TEXTAREA_COLS, DEFAULT_TEXTAREA_RESIZE, DEFAULT_TEXTAREA_ROWS} from '../Textarea'
import {FormControlArgs, formControlArgTypes, getFormControlArgsByChildComponent} from '../utils/story-helpers'

export default {
  title: 'Forms/Form Controls',
  component: Textarea,
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
  argTypes: {
    block: {
      defaultValue: false,
      control: {type: 'boolean'}
    },
    cols: {
      defaultValue: DEFAULT_TEXTAREA_COLS,
      control: {type: 'number'}
    },
    disabled: {
      defaultValue: false,
      control: {type: 'boolean'}
    },
    resize: {
      defaultValue: DEFAULT_TEXTAREA_RESIZE,
      options: ['none', 'both', 'horizontal', 'vertical'],
      control: {type: 'radio'}
    },
    rows: {
      defaultValue: DEFAULT_TEXTAREA_ROWS,
      control: {type: 'number'}
    },
    sx: {
      table: {
        disable: true
      }
    },
    validationStatus: {
      defaultValue: undefined,
      options: ['error', 'success', 'warning'],
      control: {type: 'radio'}
    },
    ...formControlArgTypes
  }
} as Meta

export const TextareaStory = (args: FormControlArgs<TextareaProps>) => {
  const {parentArgs, labelArgs, captionArgs, validationArgs} = getFormControlArgsByChildComponent(args)
  return (
    <Box as="form" sx={{p: 3}}>
      <FormControl {...parentArgs}>
        <FormControl.Label {...labelArgs} />
        <Textarea id="textarea" {...args} />
        {captionArgs.children && <FormControl.Caption {...captionArgs} />}
        {validationArgs.children && validationArgs.variant && (
          <FormControl.Validation {...validationArgs} variant={validationArgs.variant} />
        )}
      </FormControl>
    </Box>
  )
}

TextareaStory.storyName = 'Textarea'
