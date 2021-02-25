/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, {useState, useRef} from 'react'
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
  ],
  argTypes: {
    width: {
      control: {
        type: 'select',
        options: ['sm', 'md', 'lg', 'xl', 'auto']
      }
    },
    height: {
      control: {
        type: 'select',
        options: ['sm', 'md', 'auto']
      }
    }
  }
} as Meta

export const DefaultOverlay = () => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        open overlay
      </Button>
      {isOpen && <Overlay triggerRef={buttonRef} onEscape={() => setIsOpen(!isOpen)} onClickOutside={() => setIsOpen(false)} isOpen={isOpen} width="sm"> content!!</Overlay>}
    </>
  )
}
