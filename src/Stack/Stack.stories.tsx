import React from 'react'
import Stack, {defaultStackProps, StackBreakpointConfig} from './Stack'
import {ComponentProps} from '../utils/types'
import {Box} from '..'

type StackProps = Omit<ComponentProps<typeof Stack>, 'gap'> & {gap: ComponentProps<typeof Stack>['gap'] | string}
type Args = StackProps & {
  narrowAlign: StackProps['align']
  narrowAlignWrap: StackProps['alignWrap']
  narrowDirection: StackProps['direction']
  narrowGap: StackProps['gap']
  narrowGapCustom: string
  narrowShowDivider: StackProps['showDivider']
  narrowSpread: StackProps['spread']
  narrowWrap: StackProps['wrap']
  gapCustom: string
}

const StackChild: React.FC<{bgColor?: string; textColor?: string}> = ({bgColor, textColor, children}) => (
  <Box backgroundColor={bgColor || '#ddf4ff'} borderRadius={2} color={textColor || 'fg.default'} py={1} px={3}>
    {children}
  </Box>
)

export default {
  title: 'Layout/Stack',
  component: Stack,
  // TODO: update these arg types to come up with a better way to set responsive values
  argTypes: {
    _height: {
      control: {
        type: 'number'
      },
      table: {
        category: 'Debug'
      }
    },

    _width: {
      control: {
        type: 'number'
      },
      table: {
        category: 'Debug'
      }
    },

    // Direction

    direction: {
      options: ['inline', 'block'],
      control: {
        type: 'inline-radio'
      },
      description:
        'Sets how elements inside `Stack` are placed, either horizontally (`inline`) or vertically (`block`). This property follows the writing mode.',
      defaultValue: defaultStackProps.direction,
      table: {
        category: 'Properties'
      }
    },
    narrowDirection: {
      options: ['inline', 'block', undefined],
      control: {
        type: 'inline-radio'
      },
      description: 'Override `direction` on narrow viewports',
      defaultValue: undefined,
      table: {
        category: 'Narrow viewport properties'
      }
    },

    // Gap

    gap: {
      options: ['none', 'condensed', 'normal', 'spacious', 'custom'],
      control: {
        type: 'inline-radio'
      },
      description: `Sets the spacing gap between items. All sizes are rendered in \`rem\` units.
    - \`none\`: 0
    - \`condensed\`: \`var(--primer-stack-gap-condensed, 8px)\`,
    - \`normal\`: \`var(--primer-stack-gap-normal, 16px)\` (default)
    - \`spacious\`: \`var(--primer-stack-gap-spacious, 24px)\` (on regular viewports, otherwise it appears as \`normal\` on narrow viewports)
    - \`custom\`: set a custom size. When using with a framework such as ViewComponent or React, a custom value can be passed directly to the property.
     `,
      defaultValue: defaultStackProps.gap,
      table: {
        category: 'Properties'
      }
    },
    narrowGap: {
      options: ['none', 'condensed', 'normal', 'spacious', 'custom'],
      control: {
        type: 'inline-radio'
      },
      description: 'Override `gap` on narrow viewports',
      defaultValue: defaultStackProps.gap,
      table: {
        category: 'Narrow viewport properties'
      }
    },
    gapCustom: {
      control: {
        type: 'text'
      },
      description:
        'A custom value to `gap`. Refer to [Primer Primitives](https://primer.style/primitives/spacing) for other spacing tokens. Example: `var(--base-size-12, 12px)`.',
      table: {
        category: 'Properties'
      }
    },
    narrowGapCustom: {
      control: {
        type: 'text'
      },
      description: 'Override a custom value for `gap` for narrow viewports',
      table: {
        category: 'Narrow viewport properties'
      }
    },

    align: {
      options: ['stretch', 'start', 'center', 'end', 'baseline'],
      control: {
        type: 'inline-radio'
      },
      description: `Sets the alignment between items in the cross-axis of the specified direction. For example:
      - If \`direction\` is set to \`block\` (stacks vertically), it controls the horizontal alignment (left, center, right).
      - If \`direction\` is set to \`inline\` (stacks horizontally), it controls the vertical alignment (top, center, bottom).
        
      This property behavior is equivalent to the \`align-items\` Flexbox property.`,
      defaultValue: defaultStackProps.align,
      table: {
        category: 'Properties'
      }
    },
    narrowAlign: {
      options: ['stretch', 'start', 'center', 'end', 'baseline', undefined],
      control: {
        type: 'inline-radio'
      },
      defaultValue: defaultStackProps.align,
      table: {
        category: 'Narrow viewport properties'
      }
    },

    // Align wrap

    alignWrap: {
      options: ['start', 'center', 'end', 'distribute', 'distributeEvenly'],
      control: {
        type: 'inline-radio'
      },
      description:
        'Sets how stack lines are distributed, if they `wrap` into multiple lines. This has equivalent behavior to the `align-content` Flexbox property.',
      defaultValue: defaultStackProps.alignWrap,
      table: {
        category: 'Properties'
      }
    },

    narrowAlignWrap: {
      options: ['start', 'center', 'end', 'distribute', 'distributeEvenly', undefined],
      control: {
        type: 'inline-radio'
      },
      defaultValue: defaultStackProps.alignWrap,
      table: {
        category: 'Narrow viewport properties'
      }
    },

    // Spread

    spread: {
      options: ['start', 'center', 'end', 'distribute', 'distributeEvenly'],
      control: {
        type: 'inline-radio'
      },
      description: 'Sets how items will be distributed in the stacking direction.',
      defaultValue: defaultStackProps.spread,
      table: {
        category: 'Properties'
      }
    },

    narrowSpread: {
      options: ['start', 'center', 'end', 'distribute', 'distributeEvenly', undefined],
      control: {
        type: 'inline-radio'
      },
      defaultValue: defaultStackProps.spread,
      table: {
        category: 'Narrow viewport properties'
      }
    },

    // Wrap

    wrap: {
      options: ['wrap', 'nowrap'],
      control: {
        type: 'inline-radio'
      },
      description: 'Sets whether items are forced onto one line or can wrap onto multiple lines.',
      defaultValue: defaultStackProps.wrap,
      table: {
        category: 'Properties'
      }
    },
    narrowWrap: {
      options: ['wrap', 'nowrap'],
      control: {
        type: 'inline-radio'
      },
      defaultValue: defaultStackProps.wrap,
      table: {
        category: 'Narrow viewport properties'
      }
    },

    // Divider

    showDivider: {
      control: {
        type: 'boolean'
      },
      description: `Whether a divider between items is shown or not.
    
      _Note: the presence of a divider duplicates the \`gap\` between items._`,
      defaultValue: defaultStackProps.showDivider,
      table: {
        category: 'Properties'
      }
    },

    narrowShowDivider: {
      control: {
        type: 'boolean'
      },
      defaultValue: defaultStackProps.showDivider,
      table: {
        category: 'Narrow viewport properties'
      }
    },

    dividerAriaRole: {
      options: ['presentation', 'separator', 'none'],
      control: {
        type: 'inline-radio'
      },
      description: 'Sets which ARIA role will be used for the divider.',
      table: {
        category: 'Properties',
        defaultValue: 'presentation'
      }
    }
  },
  parameters: {controls: {exclude: ['sx']}}
}

export const Default = ({
  align,
  alignWrap,
  direction,
  gap,
  showDivider,
  spread,
  wrap,
  narrowAlign,
  narrowAlignWrap,
  narrowDirection,
  narrowGap,
  narrowGapCustom,
  narrowShowDivider,
  narrowSpread,
  narrowWrap,
  gapCustom,
  _height: height = 'auto',
  _width: width = 'auto'
}: Args) => {
  const getGapProp: () =>
    | StackBreakpointConfig<'condensed' | 'normal' | 'normal' | 'spacious'>
    | StackBreakpointConfig<string>
    | string = () => {
    const gapProp: StackBreakpointConfig<string | undefined> | string = {narrow: undefined, regular: undefined}

    if (narrowGap === 'custom') {
      if (narrowGapCustom) {
        gapProp.narrow = narrowGapCustom
      }

      if (gapCustom) {
        gapProp.regular = gapCustom
      }

      return gapProp
    }

    return gap || defaultStackProps.gap
  }

  // @ts-ignore
  const getResonponsiveValue = (narrowProp, regularProp) =>
    typeof narrowProp === 'string' && typeof regularProp === 'string'
      ? {narrow: narrowProp, regular: regularProp}
      : regularProp

  return (
    <Stack
      align={getResonponsiveValue(narrowAlign, align)}
      alignWrap={
        typeof narrowAlignWrap === 'string' && typeof alignWrap === 'string'
          ? {narrow: narrowAlignWrap, regular: alignWrap}
          : alignWrap
      }
      direction={
        typeof narrowDirection === 'string' && typeof direction === 'string'
          ? {narrow: narrowDirection, regular: direction}
          : direction
      }
      // TODO: get rid of this type assertion
      gap={getGapProp() as ComponentProps<typeof Stack>['gap']}
      showDivider={
        typeof narrowShowDivider === 'string' && typeof showDivider === 'string'
          ? {narrow: narrowShowDivider, regular: showDivider}
          : showDivider
      }
      spread={
        typeof narrowSpread === 'string' && typeof spread === 'string'
          ? {narrow: narrowSpread, regular: spread}
          : spread
      }
      wrap={typeof narrowWrap === 'string' && typeof wrap === 'string' ? {narrow: narrowWrap, regular: wrap} : wrap}
      sx={{height, width}}
    >
      <StackChild>One</StackChild>
      <StackChild bgColor="#b6e3ff">Two</StackChild>
      <StackChild bgColor="#80ccff">Three</StackChild>
      <StackChild bgColor="#54aeff">Four</StackChild>
      <StackChild bgColor="#218bff">Five</StackChild>
    </Stack>
  )
}
