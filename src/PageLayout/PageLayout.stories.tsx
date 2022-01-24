import {Meta, Story} from '@storybook/react'
import React from 'react'
import {Box} from '..'
import {PageLayout} from './PageLayout'

const meta: Meta = {
  title: 'Layout/PageLayout',
  component: PageLayout,
  parameters: {
    layout: 'fullscreen'
  }
}

// This might be useful in other stories/docs
const Placeholder: React.FC<{
  width?: number | string
  height: number | string
  label?: string
}> = ({width, height, label}) => {
  return (
    <Box
      sx={{
        width: width ?? '100%',
        height,
        display: 'grid',
        placeItems: 'center',
        bg: 'canvas.inset',
        border: '1px solid',
        borderColor: 'border.default',
        borderRadius: 2
      }}
    >
      {label}
    </Box>
  )
}
export const Default: Story = args => (
  <PageLayout containerWidth={args.containerWidth}>
    <PageLayout.Header>
      <Placeholder height={64} label="Header" />
    </PageLayout.Header>
    <PageLayout.Content>
      <Placeholder height={400} label="Content" />
    </PageLayout.Content>
    <PageLayout.Pane>
      <Placeholder height={200} label="Pane" />
    </PageLayout.Pane>
    <PageLayout.Footer>
      <Placeholder height={64} label="Footer" />
    </PageLayout.Footer>
  </PageLayout>
)

Default.args = {
  containerWidth: 'xlarge'
}

export default meta
