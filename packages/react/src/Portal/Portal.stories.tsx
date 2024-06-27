import React from 'react'
import type {Meta} from '@storybook/react'

import {Box} from '..'
import {Portal} from './Portal'

export default {
  title: 'Behaviors/Portal',
  component: Portal,
} as Meta<typeof Portal>

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
