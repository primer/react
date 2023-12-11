import React from 'react'
import {Meta, Story} from '@storybook/react'
import {ComponentProps} from '../../utils/types'
import {SkeletonText} from './SkeletonText'

export default {
  title: 'Drafts/Components/Skeleton/SkeletonText/Features',
  component: SkeletonText,
} as Meta<ComponentProps<typeof SkeletonText>>

export const Default = () => <SkeletonText />

export const Playground: Story<ComponentProps<typeof SkeletonText>> = args => <SkeletonText {...args} />

Playground.args = {
  size: 'bodyMedium',
  lines: 1,
}

Playground.argTypes = {
  sx: {
    controls: false,
    table: {
      disable: true,
    },
  },
  lines: {
    type: 'number',
  },
  maxWidth: {
    type: 'string',
  },
  size: {
    type: 'string',
  },
}
