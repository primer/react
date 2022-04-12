import Avatar from '../Avatar'
import {Meta} from '@storybook/react'
import React from 'react'
import {ThemeProvider} from '..'
import BaseStyles from '../BaseStyles'

const meta: Meta = {
  title: 'Building blocks/Avatar/fixtures',
  component: Avatar,
  decorators: [
    (Story: React.ComponentType): JSX.Element => (
      <ThemeProvider>
        <BaseStyles>
          <Story />
        </BaseStyles>
      </ThemeProvider>
    )
  ]
}
export default meta

export function SimpleAvatar(): JSX.Element {
  return <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/primer" />
}

export function CustomSize(): JSX.Element {
  return <Avatar size={48} alt="Primer logo" src="https://avatars.githubusercontent.com/primer" />
}

export function SquareAvatar(): JSX.Element {
  return <Avatar square alt="Primer logo" src="https://avatars.githubusercontent.com/primer" />
}

export function DefaultAltText(): JSX.Element {
  return <Avatar src="https://avatars.githubusercontent.com/primer" />
}
