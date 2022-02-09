import AvatarStack from '../../src/AvatarStack'
import Avatar from '../../src/Avatar'
import {Meta} from '@storybook/react'
import React from 'react'
import {ThemeProvider} from '../../src'
import BaseStyles from '../../src/BaseStyles'

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
      <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/primer" />
      <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
      <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
      <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/desktop" />
    </AvatarStack>
  )
}
AvatarStackStory.storyName = 'AvatarStack'
