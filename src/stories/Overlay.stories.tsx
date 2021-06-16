import React, {useState, useRef, useCallback} from 'react'
import {Meta} from '@storybook/react'
import styled from 'styled-components'
import {BaseStyles, Overlay, Button, Text, ButtonDanger, ThemeProvider, Position, Flex} from '..'
import {DropdownMenu, DropdownButton} from '../DropdownMenu'
import {ItemInput} from '../ActionList/List'

export default {
  title: 'Internal components/Overlay',
  component: Overlay,
  decorators: [
    Story => {
      return (
        <ThemeProvider>
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

  &:focus {
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
      {isOpen ? (
        <Overlay
          returnFocusRef={buttonRef}
          height="auto"
          width="small"
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
      ) : null}
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
      {isOpen ? (
        <Overlay
          initialFocusRef={confirmButtonRef}
          returnFocusRef={buttonRef}
          ignoreClickRefs={[buttonRef]}
          onEscape={closeOverlay}
          onClickOutside={closeOverlay}
          width="small"
        >
          <Flex flexDirection="column" p={2}>
            <Text>Are you sure?</Text>
            <ButtonDanger onClick={closeOverlay}>Cancel</ButtonDanger>
            <Button onClick={closeOverlay} ref={confirmButtonRef}>
              Confirm
            </Button>
          </Flex>
        </Overlay>
      ) : null}
    </Position>
  )
}

export const OverlayOnTopOfOverlay = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const secondaryButtonRef = useRef<HTMLButtonElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const closeOverlay = () => setIsOpen(false) // intentionally not memoized
  const closeSecondaryOverlay = useCallback(() => setIsSecondaryOpen(false), [setIsSecondaryOpen])
  const items = React.useMemo(
    () => [
      {
        text: '🔵 Cyan',
        onMouseDown: (e: React.MouseEvent) => {
          e.preventDefault()
        }
      },
      {
        text: '🔴 Magenta',
        onMouseDown: (e: React.MouseEvent) => {
          e.preventDefault()
        }
      },
      {
        text: '🟡 Yellow',
        onMouseDown: (e: React.MouseEvent) => {
          e.preventDefault()
        }
      }
    ],
    []
  )
  const [selectedItem, setSelectedItem] = React.useState<ItemInput | undefined>()
  return (
    <Position position="absolute" top={0} left={0} bottom={0} right={0} ref={anchorRef}>
      <input placeholder="Input for focus testing" />
      <br />
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        open overlay
      </Button>
      {isOpen ? (
        <Overlay
          initialFocusRef={confirmButtonRef}
          returnFocusRef={buttonRef}
          onEscape={closeOverlay}
          onClickOutside={closeOverlay}
          width="small"
        >
          <Button ref={secondaryButtonRef} onClick={() => setIsSecondaryOpen(!isSecondaryOpen)}>
            open overlay
          </Button>
          {isSecondaryOpen ? (
            <Overlay
              initialFocusRef={confirmButtonRef}
              returnFocusRef={secondaryButtonRef}
              onEscape={closeSecondaryOverlay}
              onClickOutside={closeSecondaryOverlay}
              width="small"
              sx={{top: '40px'}}
            >
              <Flex flexDirection="column" p={2}>
                <Text>Select an option!</Text>
                <DropdownMenu
                  renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
                    <DropdownButton aria-labelledby={`favorite-color-label ${ariaLabelledBy}`} {...anchorProps}>
                      {children}
                    </DropdownButton>
                  )}
                  placeholder="🎨"
                  items={items}
                  selectedItem={selectedItem}
                  onChange={setSelectedItem}
                />
              </Flex>
            </Overlay>
          ) : null}
        </Overlay>
      ) : null}
    </Position>
  )
}
