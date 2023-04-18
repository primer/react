import React from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, ThemeProvider} from '..'
import {Portal} from './Portal'

export default {
  title: 'Behaviors/Portal',
  component: Portal,
  decorators: [
    Story => {
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

export const Default = () => (
  <>
    Root position
    <Box bg="red.2" p={3}>
      Outer container
      <Box bg="green.2" p={3}>
        Inner container
        <Portal>
          Portaled content rendered at <code>&lt;BaseStyles&gt;</code> root.
        </Portal>
      </Box>
    </Box>
  </>
)
