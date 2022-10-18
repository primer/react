import React from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, FormControl, Textarea, TextareaProps, ThemeProvider} from '..'
import {DEFAULT_TEXTAREA_COLS, DEFAULT_TEXTAREA_RESIZE, DEFAULT_TEXTAREA_ROWS} from '../Textarea'
import {
  FormControlArgs,
  formControlArgTypes,
  formControlArgs,
  getFormControlArgsByChildComponent
} from '../utils/story-helpers'

export default {
  title: 'Components/Forms/Textarea',
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
  args: {
    ...formControlArgs,
    block: false,
    cols: DEFAULT_TEXTAREA_COLS,
    disabled: false,
    resize: DEFAULT_TEXTAREA_RESIZE,
    rows: DEFAULT_TEXTAREA_ROWS,
    validationStatus: undefined
  },
  argTypes: {
    block: {
      control: {type: 'boolean'}
    },
    cols: {
      control: {type: 'number'}
    },
    disabled: {
      control: {type: 'boolean'}
    },
    resize: {
      options: ['none', 'both', 'horizontal', 'vertical'],
      control: {type: 'radio'}
    },
    rows: {
      control: {type: 'number'}
    },
    sx: {
      table: {
        disable: true
      }
    },
    validationStatus: {
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
