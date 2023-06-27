import Link from '../Link'
import Box from '../Box'
import {Meta, StoryFn} from '@storybook/react'
import React from 'react'
import {ComponentProps} from '../utils/types'

export default {
  title: 'Components/Link/Features',
  component: Link,
} as Meta<ComponentProps<typeof Link>>

export const Muted = () => (
  <Link href="#" muted>
    Link
  </Link>
)

export const Underline = () => (
  <Link href="#" underline>
    Link
  </Link>
)

export const WithinText: StoryFn<typeof Link> = args => (
  <Box as="p">
    This{' '}
    <Link href="#" {...args}>
      link
    </Link>{' '}
    is inside of other text.
  </Box>
)

WithinText.args = {
  muted: false,
  underline: false,
}

WithinText.argTypes = {}
