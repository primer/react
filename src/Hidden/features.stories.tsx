import {ComponentMeta} from '@storybook/react'
import React from 'react'
import {Hidden} from './Hidden'
import {Box, Button} from '..'

export default {
  title: 'Drafts/Components/Hidden/Features',
  component: Hidden,
} as ComponentMeta<typeof Hidden>

export const HideContent = () => (
  <Box>
    <Hidden on="narrow"> This value is shown in regular and wide viewports</Hidden>
    <Hidden on="regular"> This value is shown in narrow and wide viewports</Hidden>
    <Hidden on="wide"> This value is shown in narrow and regular viewports</Hidden>
  </Box>
)

export const RenderContentResponsively = () => (
  <Box>
    <Hidden on="narrow">
      <Button variant="primary">I am visible on regular and wide viewport</Button>
    </Hidden>

    <Hidden on={['regular', 'wide']}>
      <Button variant="primary">I am visible on narrow viewport</Button>
    </Hidden>
  </Box>
)
