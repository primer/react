import React from 'react'
import type {Meta, StoryFn} from '@storybook/react'
import UnderlinePanels from './UnderlinePanels'

export default {
  title: 'Experimental/Components/UnderlinePanels.Tab',
  component: UnderlinePanels.Tab,
  parameters: {
    controls: {
      expanded: true,
      exclude: ['as'],
    },
  },
  args: {
    'aria-selected': true,
    counter: '14K',
  },
  argTypes: {
    'aria-selected': {
      control: {
        type: 'boolean',
      },
    },
    counter: {
      type: 'string',
    },
  },
} as Meta<typeof UnderlinePanels.Tab>

export const Playground: StoryFn = args => {
  return <UnderlinePanels.Tab {...args}>Users{args.children}</UnderlinePanels.Tab>
}
