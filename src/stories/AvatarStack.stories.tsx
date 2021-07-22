import AvatarStack from '../AvatarStack'
import {Meta} from '@storybook/react'
import React from 'react'
import {ThemeProvider} from '..'
import BaseStyles from '../BaseStyles'

const meta: Meta = {
  title: 'Composite components/AvatarStack',
  component: AvatarStack,
  decorators: [
    (Story: React.ComponentType): JSX.Element => (
      <ThemeProvider>
        <BaseStyles>
          <Story />
        </BaseStyles>
      </ThemeProvider>
    )
  ],
  parameters: {
    controls: {
      disabled: true
    }
  }
}
export default meta

export function AvatarStackStory(): JSX.Element {
  return (
    <AvatarStack>
      <img src="https://avatars.githubusercontent.com/primer" alt="" />
      <img src="https://avatars.githubusercontent.com/github" alt="" />
      <img src="https://avatars.githubusercontent.com/primer" alt="" />
      <img src="https://avatars.githubusercontent.com/github" alt="" />
    </AvatarStack>
  )
}
AvatarStackStory.storyName = 'AvatarStack'
