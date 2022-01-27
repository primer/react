import {Meta, Story} from '@storybook/react'
import React from 'react'
import {Box} from '..'
import {PageLayout} from './PageLayout'

const meta: Meta = {
  title: 'Layout/PageLayout',
  component: PageLayout,
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true}
  },
  argTypes: {
    'Pane.position': {
      type: {
        name: 'enum',
        value: ['start', 'end']
      },
      defaultValue: 'end',
      control: {
        type: 'radio'
      },
      table: {
        category: 'Pane',
        defaultValue: {
          summary: '"end"'
        }
      }
    },
    'Pane.positionWhenNarrow': {
      type: {
        name: 'enum',
        value: ['inherit', 'start', 'end']
      },
      defaultValue: 'inherit',
      control: {
        type: 'radio'
      },
      table: {
        category: 'Pane',
        defaultValue: {
          summary: '"inherit"'
        }
      }
    }
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
  <PageLayout
    containerWidth={args.containerWidth}
    outerSpacing={args.outerSpacing}
    rowGap={args.rowGap}
    columnGap={args.columnGap}
    sx={args.sx}
  >
    <PageLayout.Header divider="line" dividerWhenNarrow="filled">
      <Placeholder height={64} label="Header" />
    </PageLayout.Header>
    <PageLayout.Content>
      <Placeholder height={400} label="Content" />
    </PageLayout.Content>
    <PageLayout.Pane position={args['Pane.position']} positionWhenNarrow={args['Pane.positionWhenNarrow']}>
      <Placeholder height={200} label="Pane" />
    </PageLayout.Pane>
    <PageLayout.Footer>
      <Placeholder height={64} label="Footer" />
    </PageLayout.Footer>
  </PageLayout>
)

Default.args = {
  containerWidth: 'xlarge',
  outerSpacing: 'medium',
  rowGap: 'medium',
  columnGap: 'medium'
}

export default meta
