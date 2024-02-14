import Link from '../Link'
import type {Meta, Story} from '@storybook/react'
import React from 'react'
import type {ComponentProps} from '../utils/types'

export default {
  title: 'Components/Link',
  component: Link,
} as Meta<ComponentProps<typeof Link>>

export const Playground: Story<ComponentProps<typeof Link>> = args => <Link {...args}>Link</Link>

Playground.args = {
  href: '#',
  muted: false,
  underline: false,
  inline: false,
}

export const Default = () => <Link href="#">Link</Link>
