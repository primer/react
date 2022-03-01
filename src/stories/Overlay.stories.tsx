import React, {useState, useRef, useCallback} from 'react'
import {Meta} from '@storybook/react'
import styled from 'styled-components'
import {TriangleDownIcon, PlusIcon, IssueDraftIcon} from '@primer/octicons-react'
import {
  BaseStyles,
  Overlay,
  ButtonGroup,
  Text,
  ThemeProvider,
  Box,
  StyledOcticon,
  Checkbox,
  FormControl,
  TextInput,
  Link,
  Label,
  ActionList,
  ActionMenu
} from '..'
import {Button, ButtonInvisible, ButtonPrimary, ButtonDanger} from '../deprecated'
import type {AnchorSide} from '@primer/behaviors'
import {DropdownMenu, DropdownButton} from '../deprecated/DropdownMenu'
import {ItemInput} from '../deprecated/ActionList/List'

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

  return (
    <div>
      <TextInput />
      <div>
        primary overlay open: {String(listOverlayOpen)}, secondary overlay open: {String(createListOverlayOpen)}
      </div>
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
          top={100}
          left={16}
        >
          <Box sx={{display: 'flex', flexDirection: 'column', py: 2}}>
            <Box sx={{paddingX: 3}}>
              <Text color="fg.muted" sx={{fontSize: 1}}>
                Add to list
              </Text>
              <Box sx={{marginY: 1}}>
                <FormControl>
                  <FormControl.Label>My stack</FormControl.Label>
                  <Checkbox value="my-stack" />
                </FormControl>
                <FormControl>
                  <FormControl.Label>Want to try</FormControl.Label>
                  <Checkbox value="wanna-try" />
                </FormControl>
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

export const MemexNestedOverlays = () => {
  const [overlayOpen, setOverlayOpen] = React.useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const durations = ['days', 'weeks']
  const [duration, setDuration] = React.useState(durations[0])

  return (
    <div>
      <ButtonGroup display="block" my={2}>
        <Button>Add iteration</Button>
        <Button
          aria-label="Add custom iteration"
          ref={buttonRef}
          onClick={() => setOverlayOpen(!overlayOpen)}
          sx={{paddingX: 2}}
        >
          <TriangleDownIcon />
        </Button>
      </ButtonGroup>
      {overlayOpen && (
        <Overlay
          width="medium"
          onEscape={() => setOverlayOpen(false)}
          onClickOutside={() => setOverlayOpen(false)}
          returnFocusRef={buttonRef}
          ignoreClickRefs={[buttonRef]}
          top={60}
          left={16}
        >
          <Box as="form" onSubmit={() => setOverlayOpen(false)} sx={{display: 'flex', flexDirection: 'column', py: 2}}>
            <Box sx={{paddingX: 3, display: 'flex', alignItems: 'center', gap: 1}}>
              <Text color="fg.muted" sx={{fontSize: 1}}>
                Duration:
              </Text>
              <TextInput defaultValue={2} />
              <ActionMenu>
                <ActionMenu.Button sx={{width: 200}} aria-label="Change duration unit">
                  {duration}
                </ActionMenu.Button>
                <ActionMenu.Overlay>
                  <ActionList selectionVariant="single">
                    {durations.map(item => (
                      <ActionList.Item key={item} selected={item === duration} onSelect={() => setDuration(item)}>
                        {item}
                      </ActionList.Item>
                    ))}
                  </ActionList>
                </ActionMenu.Overlay>
              </ActionMenu>
            </Box>
            <ActionList.Divider />
            <Box sx={{display: 'flex', justifyContent: 'flex-end', px: 2, gap: 1}}>
              <Button>Cancel</Button>
              <ButtonPrimary>Add</ButtonPrimary>
            </Box>
          </Box>
        </Overlay>
      )}
    </div>
  )
}

export const MemexIssueOverlay = () => {
  const [overlayOpen, setOverlayOpen] = React.useState(false)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [title, setTitle] = React.useState('Implement draft issue editor')
  const [editing, setEditing] = React.useState(false)

  React.useEffect(() => {
    // If we just started editing, focus the newly rendered input
    if (editing) inputRef.current?.focus()
  }, [editing])

  return (
    <>
      <Link
        href="#"
        muted
        ref={linkRef}
        onClick={event => {
          event.preventDefault()
          setOverlayOpen(true)
        }}
        sx={{
          display: 'block',
          border: '1px solid',
          borderColor: 'border.default',
          p: 2,
          ':hover': {
            backgroundColor: 'canvas.subtle'
          }
        }}
      >
        <IssueDraftIcon /> {title}
      </Link>
      {overlayOpen && (
        <Overlay
          height="auto"
          width="large"
          onEscape={() => setOverlayOpen(false)}
          onClickOutside={() => setOverlayOpen(false)}
          returnFocusRef={linkRef}
          top={0}
          left={window.innerWidth - 480}
        >
          <Box sx={{p: 4, height: '100vh'}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2}}>
              <Label size="large">
                <IssueDraftIcon /> Draft
              </Label>
              <Text sx={{fontSize: 1}}>opened 2 days ago,</Text>
              <Text sx={{fontSize: 1}}>showing {editing ? 'input' : 'button'}</Text>
            </Box>
            {editing ? (
              <TextInput
                defaultValue={title}
                onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
                  setEditing(false)
                  setTitle(event.target.value)
                }}
                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                  if (event.key === 'Enter') {
                    setEditing(false)
                    setTitle((event.target as HTMLInputElement).value)
                  } else if (event.key === 'Escape') {
                    setEditing(false)
                    setTitle(title)
                    event.preventDefault() // prevent Overlay from closing, this is what we recommend
                    // event.stopPropagation() // this also works and feels nicer to use
                  }
                }}
                ref={inputRef}
                sx={{
                  width: '100%',
                  py: '2px',
                  px: '7px',
                  textAlign: 'left',
                  color: 'fg.default',
                  input: {fontWeight: 'bold', fontSize: 4, px: 0}
                }}
              />
            ) : (
              <ButtonInvisible
                ref={buttonRef}
                onClick={() => setEditing(true)}
                aria-label="Change issue title"
                sx={{
                  width: '100%',
                  fontSize: 4,
                  color: 'fg.default',
                  p: 2,
                  textAlign: 'left',
                  borderRadius: '2',
                  '&:hover': {boxShadow: 'primer.shadow.focus'}
                }}
              >
                {title}
              </ButtonInvisible>
            )}
          </Box>
        </Overlay>
      )}
    </>
  )
}
