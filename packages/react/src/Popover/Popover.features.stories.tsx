import type {Meta, StoryFn} from '@storybook/react-vite'
import Heading from '../Heading'
import Popover from './Popover'
import Text from '../Text'
import {Button} from '../Button'
import React from 'react'

export default {
  title: 'Components/Popover/Features',
  component: Popover,
} as Meta<typeof Popover>

export const CloseOnClickOutside = () => {
  const [open, setOpen] = React.useState(true)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  return (
    <>
      <Button
        style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 'var(--base-size-4)'}}
        ref={buttonRef}
        onClick={() => setOpen(prev => !prev)}
      >
        Toggle Popover
      </Button>
      <Popover relative open={open} caret="top">
        <Popover.Content
          style={{marginTop: 'var(--base-size-8)'}}
          onClickOutside={() => setOpen(false)}
          ignoreClickRefs={[buttonRef]}
        >
          <Heading style={{fontSize: 'var(--text-title-size-small)'}}>Popover heading</Heading>
          <Text as="p">Message about popovers</Text>
          <Button>Got it!</Button>
        </Popover.Content>
      </Popover>
    </>
  )
}
