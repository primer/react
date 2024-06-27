import type {Meta} from '@storybook/react'
import React from 'react'
import {Hidden} from './Hidden'
import {Box, Button} from '..'

export default {
  title: 'Drafts/Components/Hidden/Features',
  component: Hidden,
} as Meta<typeof Hidden>

export const HideContent = () => (
  <Box>
    <Hidden when="narrow"> This value is shown in regular and wide viewports</Hidden>
    <Hidden when="regular"> This value is shown in narrow and wide viewports</Hidden>
    <Hidden when="wide"> This value is shown in narrow and regular viewports</Hidden>
  </Box>
)

export const RenderContentResponsively = () => (
  <Box>
    <Hidden when="narrow">
      <Button variant="primary">I am visible when the viewport is regular or wide viewport</Button>
    </Hidden>

    <Hidden when={['regular', 'wide']}>
      <Button variant="primary">I am visible when the viewport is narrow</Button>
    </Hidden>
  </Box>
)
