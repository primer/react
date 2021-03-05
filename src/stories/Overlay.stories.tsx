/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, {useState, useRef} from 'react'
import {Meta} from '@storybook/react'
import styled from 'styled-components'

import {BaseStyles, Overlay, Button, Box, Flex, ButtonDanger} from '..'

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

const DummyItem = styled.div`
  border-radius: 6px;
  font-weight: 400;
  padding: 6px 8px;
  font-weight: 400;
  margin: 0;
  font-size: 14px;
  &:hover {
    background: #f0f3f5;
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
        <Overlay returnRef={buttonRef} height="auto" triggerRef={buttonRef} onEscape={() => setIsOpen(!isOpen)} onClickOutside={() => setIsOpen(false)} width="sm">
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
  const yesButtonRef = useRef<HTMLButtonElement>(null)
  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        open overlay
      </Button>
      {isOpen &&
        <Overlay initialFocusRef={yesButtonRef} returnRef={buttonRef} height="auto" triggerRef={buttonRef} onEscape={() => setIsOpen(!isOpen)} onClickOutside={() => setIsOpen(false)} width="sm">
          <Flex flexDirection="column" p={2}>
            <Button ref={yesButtonRef}>yes</Button>
            <Button>no</Button>
          </Flex>
        </Overlay>
      }

    </>
  )
}

