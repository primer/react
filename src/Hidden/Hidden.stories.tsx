import React from 'react'
import {Meta, Story} from '@storybook/react'

import Hidden from '.'

const meta: Meta = {
  title: 'Drafts/Components/Hidden',
  parameters: {
    controls: {
      expanded: true,
    },
  },
  args: {
    hidden: ['regular'],
  },
  argTypes: {
    hidden: {
      type: {
        name: 'enum',
        value: ['narrow', 'regular', 'wide'],
      },
      control: {type: 'multi-select'},
      description: 'The viewport type to hide the content on.',
    },
  },
}

export const Playground: Story = args => (
  <Hidden on={args.hidden}>The content is hidden on {args.hidden.join(',')}</Hidden>
)

export default meta
