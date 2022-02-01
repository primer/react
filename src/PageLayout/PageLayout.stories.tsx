import {Meta, Story} from '@storybook/react'
import React from 'react'
import {Placeholder} from '../Placeholder'
import {PageLayout} from './PageLayout'

const meta: Meta = {
  title: 'Layout/PageLayout',
  component: PageLayout,
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true}
  },
  argTypes: {
    'Render header?': {
      type: 'boolean',
      defaultValue: true,
      table: {
        category: 'Header'
      }
    },
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
    'Render pane?': {
      type: 'boolean',
      defaultValue: true,
      table: {
        category: 'Pane'
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
    'Render footer?': {
      type: 'boolean',
      defaultValue: true,
      table: {
        category: 'Footer'
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

export const Default: Story = args => (
  <PageLayout
    containerWidth={args.containerWidth}
    outerSpacing={args.outerSpacing}
    rowGap={args.rowGap}
    columnGap={args.columnGap}
    sx={args.sx}
  >
    {args['Render header?'] ? (
      <PageLayout.Header divider={args['Header.divider']} dividerWhenNarrow={args['Header.dividerWhenNarrow']}>
        <Placeholder height={64} label="Header" />
      </PageLayout.Header>
    ) : null}
    <PageLayout.Content width={args['Content.width']}>
      <Placeholder height={400} label="Content" />
    </PageLayout.Content>
    {args['Render pane?'] ? (
      <PageLayout.Pane
        position={args['Pane.position']}
        positionWhenNarrow={args['Pane.positionWhenNarrow']}
        width={args['Pane.width']}
        divider={args['Pane.divider']}
        dividerWhenNarrow={args['Pane.dividerWhenNarrow']}
      >
        <Placeholder height={200} label="Pane" />
      </PageLayout.Pane>
    ) : null}
    {args['Render footer?'] ? (
      <PageLayout.Footer divider={args['Footer.divider']} dividerWhenNarrow={args['Footer.dividerWhenNarrow']}>
        <Placeholder height={64} label="Footer" />
      </PageLayout.Footer>
    ) : null}
  </PageLayout>
)

Default.args = {
  containerWidth: 'xlarge',
  outerSpacing: 'normal',
  rowGap: 'normal',
  columnGap: 'normal'
}

export default meta
