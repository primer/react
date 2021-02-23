/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, {useState} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Overlay, Button} from '..'

export default {
  title: 'Internal components/Overlay',
  component: Overlay,
  decorators: [
    Story => {
      return (
        <BaseStyles>
          <Story />
        </BaseStyles>
      )
    }
  ]
} as Meta

export const DefaultOverlay = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        open overlay
      </Button>
      {isOpen && <Overlay> content</Overlay>}
    </>
  )
}
