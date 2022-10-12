import {Meta} from '@storybook/react'
import React from 'react'
import {ThemeProvider} from '..'
import {Hidden} from './Hidden'
import BaseStyles from '../BaseStyles'
import Box from '../Box'

const meta: Meta = {
  title: 'Layout components/Hidden',
  component: Hidden,
  decorators: [
    (Story: React.ComponentType<React.PropsWithChildren<unknown>>): JSX.Element => (
      <ThemeProvider>
        <BaseStyles>
          <Story />
        </BaseStyles>
      </ThemeProvider>
    )
  ],
  parameters: {
    controls: {
      expanded: true
    }
  },
  argTypes: {
    on: {
      type: {
        name: 'enum',
        value: ['narrow', 'regular', 'wide']
      },
      defaultValue: 'regular',
      control: {type: 'radio'}
    }
  }
}
export default meta

export const isVisibleInRegularOnly = () => (
  <Box>
    <Hidden on={['narrow', 'wide']}> This value is only shown in regular viewport</Hidden>
  </Box>
)

export const isVisibleInNarrowOnly = () => (
  <Box>
    <Hidden on={['regular', 'wide']}> This value is only shown in narrow viewport</Hidden>
  </Box>
)

export const isHiddenInNarrowOnly = () => (
  <Box>
    <Hidden on="narrow">This is hidden in narrow only</Hidden>
  </Box>
)
