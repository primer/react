/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, {useState, useRef} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Overlay, Button, Box, ButtonDanger} from '..'

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
    },
    triggerRef: {
      control: {
        type: 'text',
      }
    },
    isOpen: {
      control: {
        type: 'boolean',
      }
    },
    returnRef: {
      control: {
        type: 'text'
      }
    },
    onClickOutside: {
      control: {
        type: 'text'
      }
    },
    onEscape: {
      control: {
        type: 'text'
      }
    }
  }
} as Meta

export const DefaultOverlay = () => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const yesButtonRef = useRef<HTMLButtonElement>(null)
  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        open overlay
      </Button>
      {isOpen &&
        <Overlay initialFocusRef={yesButtonRef} returnRef={buttonRef} height="auto" triggerRef={buttonRef} onEscape={() => setIsOpen(!isOpen)} onClickOutside={() => setIsOpen(false)} isOpen={isOpen} width="sm">
          <Box p={4}>
            <Box>hello!</Box>
            <ButtonDanger>No thanks</ButtonDanger>
            <Button ref={yesButtonRef}>Yes please</Button>
          </Box>
        </Overlay>}
    </>
  )
}
