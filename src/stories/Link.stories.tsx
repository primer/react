import Link from '../Link'
import {Meta} from '@storybook/react'
import React from 'react'
import {ThemeProvider} from '..'

const meta: Meta = {
  title: 'Components/Link',
  component: Link,
  decorators: [
    (Story: React.ComponentType<React.PropsWithChildren<unknown>>): JSX.Element => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}
export default meta

export function LinkStory(): JSX.Element {
  return <Link as="i">{`Link with <i> as prop`}</Link>
}
LinkStory.storyName = 'Link'
