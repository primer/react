/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, {useState, useRef} from 'react'
import {Meta} from '@storybook/react'
import styled, { ThemeProvider } from 'styled-components'

import {BaseStyles, Overlay, Button, theme, Flex} from '..'

export default {
  title: 'Internal components/Overlay',
  component: Overlay,
  decorators: [
    Story => {
      return (
        <ThemeProvider theme={theme}>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>

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
    returnFocusRef: {
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

const DummyItem = styled.button`
  border-radius: 6px;
  font-weight: 400;
  padding: 6px 8px;
  font-weight: 400;
  text-align: left;
  margin: 0;
  font-size: 14px;
  background: none;
  border: none;
  &:hover {
    background: #f0f3f5;
  }

  &:focus{
    background: red;
  }
`

export const DropdownOverlay = () => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        open overlay
      </Button>
      {isOpen &&
        <Overlay returnFocusRef={buttonRef} height="auto" ignoreClickRefs={[buttonRef]} onEscape={() => setIsOpen(false)} onClickOutside={() => setIsOpen(false)} width="sm">
          <Flex flexDirection="column" p={2}>
            <DummyItem>Copy link</DummyItem>
            <DummyItem>Quote reply</DummyItem>
            <DummyItem>Reference in new issue</DummyItem>
            <DummyItem>Edit</DummyItem>
            <DummyItem>Delete</DummyItem>
          </Flex>
        </Overlay>}
    </>
  )
}

export const DialogOverlay = () => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const noButtonRef = useRef<HTMLButtonElement>(null)
  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        open overlay
      </Button>
      {isOpen &&
        <Overlay initialFocusRef={noButtonRef} returnFocusRef={buttonRef} height="auto" ignoreClickRefs={[buttonRef]} onEscape={() => setIsOpen(!isOpen)} onClickOutside={() => setIsOpen(false)} width="sm">
          <Flex flexDirection="column" p={2}>
            <Button >yes</Button>
            <Button ref={noButtonRef}>no</Button>
          </Flex>
        </Overlay>
      }

    </>
  )
}

