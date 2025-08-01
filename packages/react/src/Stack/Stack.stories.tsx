import type {Meta, StoryObj} from '@storybook/react-vite'
import {Stack} from '../Stack'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import type {InputType} from 'storybook/internal/csf'

type Story = StoryObj<typeof Stack>

const meta: Meta<typeof Stack> = {
  title: 'Components/Stack',
  component: Stack,
}

export default meta

export const Default: Story = {
  render: () => (
    <Stack>
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
    direction: {
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
    justify: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['start', 'center', 'end', 'space-between', 'space-betweenEvenly'],
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
    directionNarrow: {
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
    justifyNarrow: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['start', 'center', 'end', 'space-between', 'space-betweenEvenly'],
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
    directionRegular: {
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
    justifyRegular: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['start', 'center', 'end', 'space-between', 'space-betweenEvenly'],
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
    directionWide: {
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
    justifyWide: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['start', 'center', 'end', 'space-between', 'space-betweenEvenly'],
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
  render: args => {
    return (
      <Stack
        {...args}
        gap={getControlValues(args.gap, {narrow: args.gapNarrow, regular: args.gapRegular, wide: args.gapWide})}
        direction={getControlValues(args.direction, {
          narrow: args.directionNarrow,
          regular: args.directionRegular,
          wide: args.directionWide,
        })}
        padding={getControlValues(args.padding, {
          narrow: args.paddingNarrow,
          regular: args.paddingRegular,
          wide: args.paddingWide,
        })}
        align={getControlValues(args.align, {
          narrow: args.alignNarrow,
          regular: args.alignRegular,
          wide: args.alignWide,
        })}
        justify={getControlValues(args.justify, {
          narrow: args.justifyNarrow,
          regular: args.justifyRegular,
          wide: args.justifyWide,
        })}
        wrap={getControlValues(args.wrap, {narrow: args.wrapNarrow, regular: args.wrapRegular, wide: args.wrapWide})}
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
    )
  },
}

function createArgMetaData(category: string): InputType {
  return {
    control: {
      type: 'boolean',
    },
    table: {
      category,
      defaultValue: {
        summary: 'true',
      },
    },
  }
}

export const StackItemPlayground: Story = {
  args: {
    grow: true,
    growNarrow: true,
    growRegular: true,
    growWide: true,

    shrink: true,
    shrinkNarrow: true,
    shrinkRegular: true,
    shrinkWide: true,
  },
  argTypes: {
    grow: createArgMetaData('Properties'),
    growNarrow: createArgMetaData('Narrow properties'),
    growRegular: createArgMetaData('Regular properties'),
    growWide: createArgMetaData('Wide properties'),

    shrink: createArgMetaData('Properties'),
    shrinkNarrow: createArgMetaData('Narrow properties'),
    shrinkRegular: createArgMetaData('Regular properties'),
    shrinkWide: createArgMetaData('Wide properties'),
  },
  render: args => {
    return (
      <Stack gap="normal" direction="horizontal" align="center" justify="space-between" wrap="nowrap">
        <Stack.Item
          grow={getControlValues(args.grow, {
            narrow: args.growNarrow,
            regular: args.growRegular,
            wide: args.growWide,
          })}
          shrink={getControlValues(args.shrink, {
            narrow: args.shrinkNarrow,
            regular: args.shrinkRegular,
            wide: args.shrinkWide,
          })}
        >
          <div
            style={{
              background: 'var(--display-indigo-bgColor-muted)',
              borderRadius: 'var(--borderRadius-medium)',
              padding: 'var(--base-size-8)',
            }}
          >
            Adjust this item
          </div>
        </Stack.Item>
        <Stack.Item>
          <div
            style={{
              background: 'var(--display-purple-bgColor-muted)',
              borderRadius: 'var(--borderRadius-medium)',
              padding: 'var(--base-size-8)',
            }}
          >
            Fixed width
          </div>
        </Stack.Item>
        <Stack.Item>
          <div
            style={{
              background: 'var(--display-purple-bgColor-muted)',
              borderRadius: 'var(--borderRadius-medium)',
              padding: 'var(--base-size-8)',
            }}
          >
            Fixed width
          </div>
        </Stack.Item>
      </Stack>
    )
  },
}

const types = ['narrow', 'regular', 'wide'] as const

/**
 * Helper utility to get the value for a prop based on control args. This is
 * helpful when an arg can have both responsive values and a plain value. In
 * cases where both are defined, responsive values will take preference
 */
function getControlValues<T>(normal: T, responsive: ResponsiveValue<T>) {
  const match = types.some(type => {
    return responsive[type]
  })
  if (match) {
    return responsive
  }
  return normal
}
