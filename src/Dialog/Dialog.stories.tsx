import React, {useState} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, ThemeProvider} from '..'
import {Button} from '../Button'
import Dialog from './Dialog'

export default {
  title: 'Components/Dialog',
  component: Dialog,
  decorators: [
    Story => {
      // Since portal roots are registered globally, we need this line so that each storybook
      // story works in isolation.
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    },
  ],
} as Meta

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false)
  const returnFocusRef = React.useRef(null)

  return (
    <>
      <Button ref={returnFocusRef} onClick={() => setIsOpen(true)}>
        Open
      </Button>
      <Dialog
        returnFocusRef={returnFocusRef}
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        aria-labelledby="header-id"
      >
        <Dialog.Header id="header-id">Title</Dialog.Header>
        some content
      </Dialog>
    </>
  )
}
