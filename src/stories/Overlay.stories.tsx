import React, {useState, useRef, useCallback} from 'react'
import ReactDOM from 'react-dom'
import {Meta} from '@storybook/react'
import styled from 'styled-components'
import {TriangleDownIcon, PlusIcon} from '@primer/octicons-react'
import {
  BaseStyles,
  Overlay,
  Button,
  ButtonInvisible,
  ButtonPrimary,
  ButtonGroup,
  Text,
  ButtonDanger,
  ThemeProvider,
  Box,
  StyledOcticon,
  Checkbox,
  ChoiceInputField,
  TextInput,
  ActionList
} from '..'
import type {AnchorSide} from '@primer/behaviors'
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
  ],
  argTypes: {
    anchorSide: {
      defaultValue: 'inside-top',
      control: {
        type: 'radio',
        options: [
          'inside-top',
          'inside-bottom',
          'inside-left',
          'inside-right',
          'inside-center',
          'outside-top',
          'outside-bottom',
          'outside-left',
          'outside-right'
        ]
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

  &:focus {
    background: red;
  }
`
interface OverlayProps {
  anchorSide: AnchorSide
}

export const DropdownOverlay = ({anchorSide}: OverlayProps) => {
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
          anchorSide={anchorSide}
        >
          <Box display="flex" flexDirection="column" p={2}>
            <DummyItem>Copy link</DummyItem>
            <DummyItem>Quote reply</DummyItem>
            <DummyItem>Reference in new issue</DummyItem>
            <DummyItem>Edit</DummyItem>
            <DummyItem>Delete</DummyItem>
          </Box>
        </Overlay>
      ) : null}
    </>
  )
}

export const DialogOverlay = ({anchorSide}: OverlayProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const closeOverlay = () => setIsOpen(false)
  return (
    <Box position="absolute" top={0} left={0} bottom={0} right={0} ref={anchorRef}>
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
          anchorSide={anchorSide}
        >
          <Box display="flex" flexDirection="column" p={2}>
            <Text>Are you sure?</Text>
            <ButtonDanger onClick={closeOverlay}>Cancel</ButtonDanger>
            <Button onClick={closeOverlay} ref={confirmButtonRef}>
              Confirm
            </Button>
          </Box>
        </Overlay>
      ) : null}
    </Box>
  )
}

export const OverlayOnTopOfOverlay = ({anchorSide}: OverlayProps) => {
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
    <Box position="absolute" top={0} left={0} bottom={0} right={0} ref={anchorRef}>
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
          anchorSide={anchorSide}
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
              anchorSide={anchorSide}
            >
              <Box display="flex" flexDirection="column" p={2}>
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
              </Box>
            </Overlay>
          ) : null}
        </Overlay>
      ) : null}
    </Box>
  )
}

export const NestedOverlays = () => {
  const [listOverlayOpen, setListOverlayOpen] = React.useState(false)
  const [createListOverlayOpen, setCreateListOverlayOpen] = React.useState(false)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const secondaryButtonRef = useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    // eslint-disable-next-line no-console
    const handler = (event: KeyboardEvent) => console.log('global handler:', event.key)
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const hostElement = document.createElement('div')
  ReactDOM.render(<div>hello</div>, hostElement)

  return (
    <div>
      <TextInput />
      <ButtonGroup display="block" my={2}>
        <Button>Star</Button>
        <Button
          aria-label="Add this repository to a list"
          ref={buttonRef}
          onClick={() => setListOverlayOpen(!listOverlayOpen)}
          sx={{paddingX: 2}}
        >
          <TriangleDownIcon />
        </Button>
      </ButtonGroup>
      {listOverlayOpen && (
        <Overlay
          width="medium"
          onEscape={() => setListOverlayOpen(false)}
          onClickOutside={() => setListOverlayOpen(false)}
          returnFocusRef={buttonRef}
          ignoreClickRefs={[buttonRef]}
          top={60}
          left={16}
        >
          <Box sx={{display: 'flex', flexDirection: 'column', py: 2}}>
            <Box sx={{paddingX: 3}}>
              <Text color="fg.muted" sx={{fontSize: 1}}>
                Add to list
              </Text>
              <Box sx={{marginY: 1}}>
                <ChoiceInputField>
                  <ChoiceInputField.Label>My stack</ChoiceInputField.Label>
                  <Checkbox />
                </ChoiceInputField>
                <ChoiceInputField>
                  <ChoiceInputField.Label>Want to try</ChoiceInputField.Label>
                  <Checkbox />
                </ChoiceInputField>
              </Box>
            </Box>
            <ActionList.Divider />
            <ButtonInvisible
              ref={secondaryButtonRef}
              sx={{textAlign: 'left', px: 2, mx: 2}}
              onClick={() => setCreateListOverlayOpen(!createListOverlayOpen)}
            >
              <StyledOcticon icon={PlusIcon} sx={{mr: 1}} />
              Create list
            </ButtonInvisible>
          </Box>
          {createListOverlayOpen && (
            <Overlay
              width="large"
              onEscape={() => setCreateListOverlayOpen(false)}
              onClickOutside={() => setCreateListOverlayOpen(false)}
              returnFocusRef={secondaryButtonRef}
              ignoreClickRefs={[secondaryButtonRef]}
              top={120}
              left={64}
            >
              <Box as="form" sx={{display: 'flex', flexDirection: 'column', p: 3}}>
                <Text color="fg.muted" sx={{fontSize: 1, mb: 3}}>
                  Create a list to organize your starred repositories.
                </Text>
                <TextInput placeholder="Name this list" sx={{mb: 2}} />
                <TextInput as="textarea" placeholder="Write a description" rows="3" sx={{mb: 2, textarea: {p: 2}}} />

                <ButtonPrimary onClick={() => setCreateListOverlayOpen(!createListOverlayOpen)}>Create</ButtonPrimary>
              </Box>
            </Overlay>
          )}
        </Overlay>
      )}
    </div>
  )
}
