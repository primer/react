import React from 'react'
import type {Meta} from '@storybook/react'
import {BaseStyles, ThemeProvider, Button} from '..'
import Box from '../Box'
import Link from '../Link'
import {Banner} from '../Banner'
import Tooltip from './Tooltip'

/* Tooltip v1 */

export default {
  title: 'Components/Tooltip',
  component: Tooltip,

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
    <Box sx={{mb: 3}}>
      <Banner
        title="Planned for deprecation"
        description={
          <>
            There are plans to deprecate this component in a future release. We recommend using{' '}
            <Link href="/?path=/story/components-tooltipv2--default">Tooltip</Link> instead.
          </>
        }
        variant="warning"
      />
    </Box>
    <Box sx={{p: 5}}>
      <Tooltip aria-label="Hello, Tooltip!">
        <Button>Hover me</Button>
      </Tooltip>
    </Box>
  </>
)
