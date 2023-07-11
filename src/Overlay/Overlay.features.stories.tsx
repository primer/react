import React, {useState, useRef, useCallback} from 'react'
import {Meta} from '@storybook/react'
import {TriangleDownIcon, PlusIcon, IssueDraftIcon} from '@primer/octicons-react'
import {
  Overlay,
  ButtonGroup,
  Button,
  IconButton,
  Text,
  Box,
  Checkbox,
  CheckboxGroup,
  FormControl,
  TextInput,
  Link,
  Label,
  ActionList,
  ActionMenu,
} from '..'
import type {AnchorSide} from '@primer/behaviors'

export default {
  title: 'Private/Components/Overlay',
  component: Overlay,
  args: {
    anchorSide: 'inside-top',
  },
  argTypes: {
    anchorSide: {
      control: {
        type: 'radio',
      },
      options: [
        'inside-top',
        'inside-bottom',
        'inside-left',
        'inside-right',
        'inside-center',
        'outside-top',
        'outside-bottom',
        'outside-left',
        'outside-right',
      ],
    },
  },
} as Meta

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
          <ActionList>
            <ActionList.Item>Copy link</ActionList.Item>
            <ActionList.Item>Quote reply</ActionList.Item>
            <ActionList.Item>Reference in new issue</ActionList.Item>
            <ActionList.Item>Edit</ActionList.Item>
            <ActionList.Divider />
            <ActionList.Item variant="danger">Delete</ActionList.Item>
          </ActionList>
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
    <Box ref={anchorRef}>
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
            <Button variant="danger" onClick={closeOverlay}>
              Cancel
            </Button>
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
  const items = ['🔵 Cyan', '🔴 Magenta', '🟡 Yellow']
  const [selectedItem, setSelectedItem] = React.useState(items[0])

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
                <ActionMenu>
                  <ActionMenu.Button sx={{width: 200}}>{selectedItem}</ActionMenu.Button>
                  <ActionMenu.Overlay>
                    <ActionList selectionVariant="single">
                      {items.map(item => (
                        <ActionList.Item
                          key={item}
                          selected={item === selectedItem}
                          onSelect={() => setSelectedItem(item)}
                        >
                          {item}
                        </ActionList.Item>
                      ))}
                    </ActionList>
                  </ActionMenu.Overlay>
                </ActionMenu>
              </Box>
            </Overlay>
          ) : null}
        </Overlay>
      ) : null}
    </Box>
  )
}

export const MemexNestedOverlays = () => {
  const [overlayOpen, setOverlayOpen] = React.useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const durations = ['days', 'weeks']
  const [duration, setDuration] = React.useState(durations[0])

  return (
    <div>
      <ButtonGroup>
        <Button>Add iteration</Button>
        <IconButton
          aria-label="Add custom iteration"
          ref={buttonRef}
          onClick={() => setOverlayOpen(!overlayOpen)}
          icon={TriangleDownIcon}
        />
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
              <Button variant="primary">Add</Button>
            </Box>
          </Box>
        </Overlay>
      )}
    </div>
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
      <TextInput placeholder="Input for focus testing" />
      <div>
        primary overlay open: {String(listOverlayOpen)}, secondary overlay open: {String(createListOverlayOpen)}
      </div>
      <ButtonGroup>
        <Button>Star</Button>
        <IconButton
          aria-label="Add this repository to a list"
          ref={buttonRef}
          onClick={() => setListOverlayOpen(!listOverlayOpen)}
          icon={TriangleDownIcon}
        />
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
            <Box sx={{paddingX: 3, paddingY: 2}}>
              <CheckboxGroup>
                <CheckboxGroup.Label>Add to list</CheckboxGroup.Label>
                <FormControl>
                  <FormControl.Label>My stack</FormControl.Label>
                  <FormControl.Caption id="custom-checkbox-one-caption">Personal repositories</FormControl.Caption>
                  <Checkbox value="my-stack" />
                </FormControl>
                <FormControl>
                  <FormControl.Label>Want to try</FormControl.Label>
                  <FormControl.Caption id="custom-checkbox-one-caption">Testing new libraries</FormControl.Caption>
                  <Checkbox value="wanna-try" />
                </FormControl>
              </CheckboxGroup>
            </Box>
            <ActionList.Divider />
            <Button
              variant="invisible"
              ref={secondaryButtonRef}
              sx={{px: 2, mx: 2, display: 'flex'}}
              leadingIcon={PlusIcon}
              onClick={() => setCreateListOverlayOpen(!createListOverlayOpen)}
            >
              Create list
            </Button>
          </Box>
          {createListOverlayOpen && (
            <Overlay
              width="medium"
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
                <TextInput as="textarea" placeholder="Write a description" rows={3} sx={{mb: 2, textarea: {p: 2}}} />

                <Button variant="primary" onClick={() => setCreateListOverlayOpen(!createListOverlayOpen)}>
                  Create
                </Button>
              </Box>
            </Overlay>
          )}
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
            backgroundColor: 'canvas.subtle',
          },
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
          left="calc(100vw - 480px)"
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
                  input: {fontWeight: 'bold', fontSize: 4, px: 0},
                }}
              />
            ) : (
              <Button
                variant="invisible"
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
                }}
              >
                {title}
              </Button>
            )}
          </Box>
        </Overlay>
      )}
    </>
  )
}

export const PositionedOverlays = ({right}: {right?: boolean}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right'>(right ? 'right' : 'left')
  const buttonRef = useRef<HTMLButtonElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const closeOverlay = () => setIsOpen(false)
  return (
    <Box ref={anchorRef}>
      <Button
        ref={buttonRef}
        onClick={() => {
          setIsOpen(!isOpen)
          setDirection('left')
        }}
      >
        Open left overlay
      </Button>
      <Button
        ref={buttonRef}
        onClick={() => {
          setIsOpen(!isOpen)
          setDirection('right')
        }}
        sx={{
          mt: 2,
        }}
      >
        Open right overlay
      </Button>
      {isOpen ? (
        direction === 'left' ? (
          <Overlay
            initialFocusRef={confirmButtonRef}
            returnFocusRef={buttonRef}
            ignoreClickRefs={[buttonRef]}
            onEscape={closeOverlay}
            onClickOutside={closeOverlay}
            width="auto"
            anchorSide="inside-right"
          >
            <Box
              sx={{
                height: '100vh',
                width: '500px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text>Look! left aligned</Text>
            </Box>
          </Overlay>
        ) : (
          <Overlay
            initialFocusRef={confirmButtonRef}
            returnFocusRef={buttonRef}
            ignoreClickRefs={[buttonRef]}
            onEscape={closeOverlay}
            onClickOutside={closeOverlay}
            width="auto"
            anchorSide={'inside-left'}
            right={0}
            position="fixed"
          >
            <Box
              sx={{
                height: '100vh',
                width: '500px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text>Look! right aligned</Text>
            </Box>
          </Overlay>
        )
      ) : null}
    </Box>
  )
}
