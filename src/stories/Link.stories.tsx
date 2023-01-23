import Link from '../Link'
import {Meta} from '@storybook/react'
import React from 'react'
import {ThemeProvider} from '..'
import BaseStyles from '../BaseStyles'

const meta: Meta = {
  title: 'Components/Link',
  component: Link,
  decorators: [
    (Story: React.ComponentType<React.PropsWithChildren<unknown>>): JSX.Element => (
      <ThemeProvider>
        <BaseStyles>
          <Story />
        </BaseStyles>
      </ThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      disable: true,
    },
  },
}
export default meta

export function LinkStory(): JSX.Element {
  return <Link as="i"> hi</Link>
}
LinkStory.storyName = 'Link'
