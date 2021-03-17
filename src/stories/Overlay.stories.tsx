/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, {useState, useRef} from 'react'
import {Meta} from '@storybook/react'
import styled, { ThemeProvider } from 'styled-components'

import {BaseStyles, Overlay, Button, Text, ButtonDanger, theme, Position, Flex} from '..'

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
  ]
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
      <Button ref={buttonRef} sx={{position: 'relative'}} onClick={() => setIsOpen(!isOpen)}>
        open overlay
      </Button>
      {isOpen &&
        <Overlay
          anchorRef={buttonRef}
          returnFocusRef={buttonRef}
          height="auto"
          width="sm"
          ignoreClickRefs={[buttonRef]}
          onEscape={() => setIsOpen(false)}
          onClickOutside={() => setIsOpen(false)}
        >
          <Flex flexDirection="column" p={2}>
            <DummyItem>Copy link</DummyItem>
            <DummyItem>Quote reply</DummyItem>
            <DummyItem>Reference in new issue</DummyItem>
            <DummyItem>Edit</DummyItem>
            <DummyItem>Delete</DummyItem>
          </Flex>
        </Overlay>
      }
    </>
  )
}

export const DialogOverlay = () => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const closeOverlay = () => setIsOpen(false)
  return (
    <Position position="absolute" top={0} left={0} bottom={0} right={0} ref={anchorRef}>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        open overlay
      </Button>
      {isOpen &&
          <Overlay
            positionSettings={{side: 'inside-center', align: 'center'}}
            anchorRef={anchorRef}
            initialFocusRef={confirmButtonRef}
            returnFocusRef={buttonRef}
            ignoreClickRefs={[buttonRef]}
            onEscape={closeOverlay}
            onClickOutside={closeOverlay}
            width="sm"
          >
            <Flex flexDirection="column" p={2}>
              <Text>Are you sure?</Text>
              <ButtonDanger onClick={closeOverlay}>Cancel</ButtonDanger>
              <Button onClick={closeOverlay} ref={confirmButtonRef}>Confirm</Button>
            </Flex>
          </Overlay>
      }
    </Position>
  )
}

