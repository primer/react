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
    'Header.divider': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
      defaultValue: 'none',
      control: {
        type: 'radio'
      },
      table: {
        category: 'Header',
        defaultValue: {
          summary: '"none"'
        }
      }
    },
    'Header.dividerWhenNarrow': {
      type: {
        name: 'enum',
        value: ['inherit', 'none', 'line', 'filled']
      },
      defaultValue: 'inherit',
      control: {
        type: 'radio'
      },
      table: {
        category: 'Header',
        defaultValue: {
          summary: '"inherit"'
        }
      }
    },
    'Content.width': {
      type: {
        name: 'enum',
        value: ['full', 'medium', 'large', 'xlarge']
      },
      defaultValue: 'full',
      control: {
        type: 'radio'
      },
      table: {
        category: 'Content',
        defaultValue: {
          summary: '"full"'
        }
      }
    },
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
    },
    'Pane.width': {
      type: {
        name: 'enum',
        value: ['small', 'medium', 'large']
      },
      defaultValue: 'medium',
      control: {
        type: 'radio'
      },
      table: {
        category: 'Pane',
        defaultValue: {
          summary: '"medium"'
        }
      }
    },
    'Pane.divider': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
      defaultValue: 'none',
      control: {
        type: 'radio'
      },
      table: {
        category: 'Pane',
        defaultValue: {
          summary: '"none"'
        }
      }
    },
    'Pane.dividerWhenNarrow': {
      type: {
        name: 'enum',
        value: ['inherit', 'none', 'line', 'filled']
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
    },
    'Footer.divider': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
      defaultValue: 'none',
      control: {
        type: 'radio'
      },
      table: {
        category: 'Footer',
        defaultValue: {
          summary: '"none"'
        }
      }
    },
    'Footer.dividerWhenNarrow': {
      type: {
        name: 'enum',
        value: ['inherit', 'none', 'line', 'filled']
      },
      defaultValue: 'inherit',
      control: {
        type: 'radio'
      },
      table: {
        category: 'Footer',
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
    <PageLayout.Header divider={args['Header.divider']} dividerWhenNarrow={args['Header.dividerWhenNarrow']}>
      <Placeholder height={64} label="Header" />
    </PageLayout.Header>
    <PageLayout.Content width={args['Content.width']}>
      <Placeholder height={400} label="Content" />
    </PageLayout.Content>
    <PageLayout.Pane
      position={args['Pane.position']}
      positionWhenNarrow={args['Pane.positionWhenNarrow']}
      width={args['Pane.width']}
      divider={args['Pane.divider']}
      dividerWhenNarrow={args['Pane.dividerWhenNarrow']}
    >
      <Placeholder height={200} label="Pane" />
    </PageLayout.Pane>
    <PageLayout.Footer divider={args['Footer.divider']} dividerWhenNarrow={args['Footer.dividerWhenNarrow']}>
      <Placeholder height={64} label="Footer" />
    </PageLayout.Footer>
  </PageLayout>
)

Default.args = {
  containerWidth: 'xlarge',
  outerSpacing: 'normal',
  rowGap: 'normal',
  columnGap: 'normal'
}

export default meta
