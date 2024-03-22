import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {Stack, StackItem} from './Stack'

type Story = StoryObj<typeof Stack>

const meta: Meta<typeof Stack> = {
  title: 'Drafts/Components/Stack',
  component: Stack,
}

export default meta

export const Default: Story = {
  render: () => (
    <Stack>
      <div>First</div>
      <div>Second</div>
      <div>Third</div>
    </Stack>
  ),
}

export const Playground: Story = {
  argTypes: {
    gap: {
      control: {
        type: 'inline-radio',
      },
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal', 'spacious'],
      },
      table: {
        category: 'Properties',
        defaultValue: {
          summary: 'normal',
        },
      },
    },
    orientation: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['horizontal', 'vertical'],
      },
      table: {
        category: 'Properties',
        defaultValue: {
          summary: 'horizontal',
        },
      },
    },
    padding: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal', 'spacious'],
      },
      table: {
        category: 'Properties',
        defaultValue: {
          summary: 'none',
        },
      },
    },
    align: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['stretch', 'start', 'center', 'end', 'baseline'],
      },
      table: {
        category: 'Properties',
        defaultValue: {
          summary: 'stretch',
        },
      },
    },
    spread: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['start', 'center', 'end', 'distribute', 'distributeEvenly'],
      },
      table: {
        category: 'Properties',
        defaultValue: {
          summary: 'start',
        },
      },
    },
    wrap: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['wrap', 'nowrap'],
      },
      table: {
        category: 'Properties',
        defaultValue: {
          summary: 'nowrap',
        },
      },
    },
    gapNarrow: {
      control: {
        type: 'inline-radio',
      },
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal', 'spacious'],
      },
      table: {
        category: 'Narrow properties',
        defaultValue: {
          summary: 'normal',
        },
      },
    },
    orientationNarrow: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['horizontal', 'vertical'],
      },
      table: {
        category: 'Narrow properties',
        defaultValue: {
          summary: 'horizontal',
        },
      },
    },
    paddingNarrow: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal', 'spacious'],
      },
      table: {
        category: 'Narrow properties',
        defaultValue: {
          summary: 'none',
        },
      },
    },
    alignNarrow: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['stretch', 'start', 'center', 'end', 'baseline'],
      },
      table: {
        category: 'Narrow properties',
        defaultValue: {
          summary: 'stretch',
        },
      },
    },
    spreadNarrow: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['start', 'center', 'end', 'distribute', 'distributeEvenly'],
      },
      table: {
        category: 'Narrow properties',
        defaultValue: {
          summary: 'start',
        },
      },
    },
    wrapNarrow: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['wrap', 'nowrap'],
      },
      table: {
        category: 'Narrow properties',
        defaultValue: {
          summary: 'nowrap',
        },
      },
    },
    gapRegular: {
      control: {
        type: 'inline-radio',
      },
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal', 'spacious'],
      },
      table: {
        category: 'Regular properties',
        defaultValue: {
          summary: 'normal',
        },
      },
    },
    orientationRegular: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['horizontal', 'vertical'],
      },
      table: {
        category: 'Regular properties',
        defaultValue: {
          summary: 'horizontal',
        },
      },
    },
    paddingRegular: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal', 'spacious'],
      },
      table: {
        category: 'Regular properties',
        defaultValue: {
          summary: 'none',
        },
      },
    },
    alignRegular: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['stretch', 'start', 'center', 'end', 'baseline'],
      },
      table: {
        category: 'Regular properties',
        defaultValue: {
          summary: 'stretch',
        },
      },
    },
    spreadRegular: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['start', 'center', 'end', 'distribute', 'distributeEvenly'],
      },
      table: {
        category: 'Regular properties',
        defaultValue: {
          summary: 'start',
        },
      },
    },
    wrapRegular: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['wrap', 'nowrap'],
      },
      table: {
        category: 'Regular properties',
        defaultValue: {
          summary: 'nowrap',
        },
      },
    },
    gapWide: {
      control: {
        type: 'inline-radio',
      },
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal', 'spacious'],
      },
      table: {
        category: 'Wide properties',
        defaultValue: {
          summary: 'normal',
        },
      },
    },
    orientationWide: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['horizontal', 'vertical'],
      },
      table: {
        category: 'Wide properties',
        defaultValue: {
          summary: 'horizontal',
        },
      },
    },
    paddingWide: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal', 'spacious'],
      },
      table: {
        category: 'Wide properties',
        defaultValue: {
          summary: 'none',
        },
      },
    },
    alignWide: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['stretch', 'start', 'center', 'end', 'baseline'],
      },
      table: {
        category: 'Wide properties',
        defaultValue: {
          summary: 'stretch',
        },
      },
    },
    spreadWide: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['start', 'center', 'end', 'distribute', 'distributeEvenly'],
      },
      table: {
        category: 'Wide properties',
        defaultValue: {
          summary: 'start',
        },
      },
    },
    wrapWide: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['wrap', 'nowrap'],
      },
      table: {
        category: 'Wide properties',
        defaultValue: {
          summary: 'nowrap',
        },
      },
    },
  },
  render: args => (
    <Stack
      {...args}
      gap={{narrow: args.gapNarrow, regular: args.gapRegular, wide: args.gapWide}}
      orientation={{narrow: args.orientationNarrow, regular: args.orientationRegular, wide: args.orientationWide}}
      padding={{narrow: args.paddingNarrow, regular: args.paddingRegular, wide: args.paddingWide}}
      align={{narrow: args.alignNarrow, regular: args.alignRegular, wide: args.alignWide}}
      spread={{narrow: args.spreadNarrow, regular: args.spreadRegular, wide: args.spreadWide}}
      wrap={{narrow: args.wrapNarrow, regular: args.wrapRegular, wide: args.wrapWide}}
      className="demoStack"
    >
      <div
        style={{
          background: 'var(--display-lemon-bgColor-muted)',
          borderRadius: 'var(--borderRadius-medium)',
          padding: 'var(--base-size-8)',
        }}
      >
        First
      </div>
      <div
        style={{
          background: 'var(--display-olive-bgColor-muted)',
          borderRadius: 'var(--borderRadius-medium)',
          padding: 'var(--base-size-8)',
        }}
      >
        Second
      </div>
      <div
        style={{
          background: 'var(--display-lime-bgColor-muted)',
          borderRadius: 'var(--borderRadius-medium)',
          padding: 'var(--base-size-8)',
        }}
      >
        Third
      </div>
    </Stack>
  ),
}

export const StackItemPlayground: Story = {
  args: {
    expand: true,
    expandNarrow: true,
    expandRegular: true,
    expandWide: true,
  },
  argTypes: {
    expand: {
      control: {
        type: 'boolean',
      },
      table: {
        category: 'Properties',
        defaultValue: {
          summary: 'true',
        },
      },
    },
    expandNarrow: {
      control: {
        type: 'boolean',
      },
      table: {
        category: 'Narrow properties',
        defaultValue: {
          summary: 'true',
        },
      },
    },
    expandRegular: {
      control: {
        type: 'boolean',
      },
      table: {
        category: 'Regular properties',
        defaultValue: {
          summary: 'true',
        },
      },
    },
    expandWide: {
      control: {
        type: 'boolean',
      },
      table: {
        category: 'Wide properties',
        defaultValue: {
          summary: 'true',
        },
      },
    },
  },
  render: args => (
    <Stack gap="normal" orientation="horizontal" align="center" spread="distribute" wrap="nowrap">
      <StackItem expand={{narrow: args.expandNarrow, regular: args.expandRegular, wide: args.expandWide}}>
        <div
          style={{
            background: 'var(--display-indigo-bgColor-muted)',
            borderRadius: 'var(--borderRadius-medium)',
            padding: 'var(--base-size-8)',
          }}
        >
          Adjust this item
        </div>
      </StackItem>
      <StackItem>
        <div
          style={{
            background: 'var(--display-purple-bgColor-muted)',
            borderRadius: 'var(--borderRadius-medium)',
            padding: 'var(--base-size-8)',
          }}
        >
          Fixed width
        </div>
      </StackItem>
      <StackItem>
        <div
          style={{
            background: 'var(--display-purple-bgColor-muted)',
            borderRadius: 'var(--borderRadius-medium)',
            padding: 'var(--base-size-8)',
          }}
        >
          Fixed width
        </div>
      </StackItem>
    </Stack>
  ),
}
