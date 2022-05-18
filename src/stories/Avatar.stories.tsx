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

export function AcceptsRef(): JSX.Element {
  const ref = React.useRef<HTMLImageElement>(null)

  return <Avatar ref={ref} src="https://avatars.githubusercontent.com/primer" data-test-id="avatar" />
}

export function AcceptsSxProp(): JSX.Element {
  return (
    <>
      <Avatar sx={{marginRight: 4}} src="https://avatars.githubusercontent.com/primer" />
      <span>text pushed to right because avatar has margin</span>
    </>
  )
}
