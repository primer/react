import AvatarStack from '../AvatarStack'
import Avatar from '../Avatar'
import {Dialog} from '../Dialog/Dialog'
import {Meta} from '@storybook/react'
import React, {useState} from 'react'
import {Button, ThemeProvider} from '..'
import BaseStyles from '../BaseStyles'

const meta: Meta = {
  title: 'Components/AvatarStack',
  component: AvatarStack,
  decorators: [
    (Story: React.ComponentType<React.PropsWithChildren<unknown>>): JSX.Element => (
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
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div>
      <p>Avatar stacks should gray out when the dialog is displayed, and they should show behind the dialog.</p>
      <AvatarStack>
        <Avatar alt="Primer logo" src="https://avatars.githubusercontent.com/primer" />
        <Avatar alt="GitHub logo" src="https://avatars.githubusercontent.com/github" />
        <Avatar alt="Atom logo" src="https://avatars.githubusercontent.com/atom" />
        <Avatar alt="GitHub Desktop logo" src="https://avatars.githubusercontent.com/desktop" />
      </AvatarStack>
      <Button onClick={() => setDialogOpen(!dialogOpen)} sx={{my: 4}}>
        Show dialog
      </Button>
      {dialogOpen && (
        <Dialog title="Test dialog" width="xlarge" onClose={() => setDialogOpen(false)}>
          Content
        </Dialog>
      )}
    </div>
  )
}
AvatarStackStory.storyName = 'AvatarStack'
