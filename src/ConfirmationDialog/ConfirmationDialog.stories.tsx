import React from 'react'
import {Meta} from '@storybook/react'
import {BaseStyles,  ThemeProvider} from '..'
import {ConfirmationDialog} from './ConfirmationDialog'

export default {
  title: 'Components/ConfirmationDialog',
  component: ConfirmationDialog,
  decorators: [
    Story => {
      // Since portal roots are registered globally, we need this line so that each storybook
      // story works in isolation.
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    },
  ],
} as Meta

