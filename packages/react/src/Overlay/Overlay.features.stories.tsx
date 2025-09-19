import React, {useState, useRef, useCallback} from 'react'
import type {Args, Meta} from '@storybook/react-vite'
import {TriangleDownIcon, PlusIcon, IssueDraftIcon, XIcon} from '@primer/octicons-react'
import {
  Overlay,
  ButtonGroup,
  Button,
  IconButton,
  Text,
  Checkbox,
  CheckboxGroup,
  FormControl,
  TextInput,
  Link,
  Label,
  ActionList,
  ActionMenu,
  useFocusTrap,
  Textarea,
} from '..'
import {Tooltip} from '../TooltipV2'
import classes from './Overlay.features.stories.module.css'

export default {
  title: 'Private/Components/Overlay/Features',
  component: Overlay,
  args: {
    anchorSide: 'inside-top',
    role: 'dialog',
    open: false,
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
    role: {
      type: 'string',
    },
    open: {
      control: false,
      visible: false,
    },
  },
} as Meta

export const DropdownOverlay = ({anchorSide, open}: Args) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button ref={buttonRef} sx={{position: 'relative'}} onClick={() => setIsOpen(!isOpen)}>
        open overlay
      </Button>
      {isOpen || open ? (
        <Overlay
          returnFocusRef={buttonRef}
          height="auto"
          width="small"
          ignoreClickRefs={[buttonRef]}
          onEscape={() => setIsOpen(false)}
          onClickOutside={() => setIsOpen(false)}
          anchorSide={anchorSide}
          role="none"
        >
          <ActionList role="menu">
            <ActionList.Item role="menuitem">Copy link</ActionList.Item>
            <ActionList.Item role="menuitem">Quote reply</ActionList.Item>
            <ActionList.Item role="menuitem">Reference in new issue</ActionList.Item>
            <ActionList.Item role="menuitem">Edit</ActionList.Item>
            <ActionList.Divider />
            <ActionList.Item variant="danger" role="menuitem">
              Delete
            </ActionList.Item>
          </ActionList>
        </Overlay>
      ) : null}
    </>
  )
}

export const DialogOverlay = ({anchorSide, role, open}: Args) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const closeOverlay = () => setIsOpen(false)
  useFocusTrap({containerRef, disabled: !isOpen, initialFocusRef: confirmButtonRef, returnFocusRef: buttonRef})

  return (
    <div ref={anchorRef}>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        open overlay
      </Button>
      {isOpen || open ? (
        <Overlay
          initialFocusRef={confirmButtonRef}
          returnFocusRef={buttonRef}
          ignoreClickRefs={[buttonRef]}
          onEscape={closeOverlay}
          onClickOutside={closeOverlay}
          width="small"
          anchorSide={anchorSide}
          role={role}
          aria-modal={role === 'dialog' ? 'true' : undefined}
          aria-label={role === 'dialog' ? 'Confirmation screen' : undefined}
          ref={containerRef}
        >
          <div className={classes.DialogContent}>
            <Text>Are you sure?</Text>
            <Button variant="danger" onClick={closeOverlay}>
              Cancel
            </Button>
            <Button onClick={closeOverlay} ref={confirmButtonRef}>
              Confirm
            </Button>
          </div>
        </Overlay>
      ) : null}
    </div>
  )
}

export const OverlayOnTopOfOverlay = ({anchorSide, role, open}: Args) => {
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

  const primaryContainer = useRef<HTMLDivElement>(null)
  const secondaryContainer = useRef<HTMLDivElement>(null)

  useFocusTrap({
    containerRef: !isSecondaryOpen ? primaryContainer : secondaryContainer,
    disabled: !isOpen,
  })

  return (
    <div className={classes.FullscreenAnchor} ref={anchorRef}>
      <input placeholder="Input for focus testing" />
      <br />
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        open overlay
      </Button>
      {isOpen || open ? (
        <Overlay
          initialFocusRef={confirmButtonRef}
          returnFocusRef={buttonRef}
          onEscape={closeOverlay}
          onClickOutside={closeOverlay}
          width="small"
          anchorSide={anchorSide}
          role={role}
          aria-modal={role === 'dialog' ? 'true' : undefined}
          aria-label={role === 'dialog' ? 'Open overlay' : undefined}
          ref={primaryContainer}
          preventOverflow={false}
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
              role={role}
              aria-modal={role === 'dialog' ? 'true' : undefined}
              aria-label={role === 'dialog' ? 'Options' : undefined}
              ref={secondaryContainer}
              preventOverflow={false}
            >
              <div className={classes.SelectOptionsContent}>
                <Text>Select an option!</Text>
                <ActionMenu>
                  <ActionMenu.Button>{selectedItem}</ActionMenu.Button>
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
              </div>
            </Overlay>
          ) : null}
        </Overlay>
      ) : null}
    </div>
  )
}

export const MemexNestedOverlays = ({role, open}: Args) => {
  const [overlayOpen, setOverlayOpen] = React.useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const durations = ['days', 'weeks']
  const [duration, setDuration] = React.useState(durations[0])
  useFocusTrap({containerRef, disabled: !overlayOpen, returnFocusRef: buttonRef})

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
      {(overlayOpen || open) && (
        <Overlay
          width="auto"
          onEscape={() => setOverlayOpen(false)}
          onClickOutside={() => setOverlayOpen(false)}
          returnFocusRef={buttonRef}
          ignoreClickRefs={[buttonRef]}
          top={60}
          left={16}
          role={role}
          aria-modal={role === 'dialog' ? 'true' : undefined}
          aria-label={role === 'dialog' ? 'Add iteration' : undefined}
          ref={containerRef}
          preventOverflow={false}
        >
 
          <form onSubmit={() => setOverlayOpen(false)} className={classes.FormContainer} aria-label="Set Duration Form">
            <div className={classes.FormRow}>
              <Text color="fg.muted" fontSize={1}>
                 Duration:
              </Text>
              <TextInput defaultValue={2} aria-label="Duration" />
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
            </div>
            <ActionList.Divider />
            <div className={classes.FormActions}>
              <Button>Cancel</Button>
              <Button variant="primary">Add</Button>
            </div>
          </form>
        </Overlay>
      )}
    </div>
  )
}

export const NestedOverlays = ({role, open}: Args) => {
  const [listOverlayOpen, setListOverlayOpen] = React.useState(false)
  const [createListOverlayOpen, setCreateListOverlayOpen] = React.useState(false)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const secondaryButtonRef = useRef<HTMLButtonElement>(null)
  const primaryContainer = useRef<HTMLDivElement>(null)
  const secondaryContainer = useRef<HTMLDivElement>(null)

  useFocusTrap({
    containerRef: !createListOverlayOpen ? primaryContainer : secondaryContainer,
    disabled: !listOverlayOpen,
  })

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
      {(listOverlayOpen || open) && (
        <Overlay
          width="medium"
          onEscape={() => setListOverlayOpen(false)}
          onClickOutside={() => setListOverlayOpen(false)}
          returnFocusRef={buttonRef}
          ignoreClickRefs={[buttonRef]}
          top={100}
          left={16}
          preventOverflow={false}
          ref={primaryContainer}
          role={role}
          aria-modal={role === 'dialog' ? 'true' : undefined}
          aria-label={role === 'dialog' ? 'Sample list' : undefined}
        >
          <div className={classes.NestedOverlayContent}>
            <div className={classes.CheckboxContainer}>
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
            </div>
            <ActionList.Divider />
            <Tooltip text="Allows you to add more lists">
              <Button
                variant="invisible"
                ref={secondaryButtonRef}
                sx={{px: 2, mx: 2, display: 'flex'}}
                leadingVisual={PlusIcon}
                onClick={() => setCreateListOverlayOpen(!createListOverlayOpen)}
              >
                Create list
              </Button>
            </Tooltip>
          </div>
          {createListOverlayOpen && (
            <Overlay
              width="medium"
              onEscape={() => setCreateListOverlayOpen(false)}
              onClickOutside={() => setCreateListOverlayOpen(false)}
              returnFocusRef={secondaryButtonRef}
              ignoreClickRefs={[secondaryButtonRef]}
              top={120}
              left={64}
              role={role}
              aria-modal={role === 'dialog' ? 'true' : undefined}
              aria-label={role === 'dialog' ? 'Create a list' : undefined}
              ref={secondaryContainer}
            >
              <form className={classes.CreateFormContent} aria-label="Set Duration Form">
                <Text color="fg.muted" fontSize={1} mb={3}>
                   Create a list to organize your starred repositories.
                </Text>
                <TextInput placeholder="Name this list" className={classes.TextInputWithMargin} />
                <Textarea placeholder="Write a description" rows={3} className={classes.TextInputWithMargin} />

                <Button variant="primary" onClick={() => setCreateListOverlayOpen(!createListOverlayOpen)}>
                  Create
                </Button>
              </form>
            </Overlay>
          )}
        </Overlay>
      )}
    </div>
  )
}

export const MemexIssueOverlay = ({role, open}: Args) => {
  const [overlayOpen, setOverlayOpen] = React.useState(false)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [title, setTitle] = React.useState('Implement draft issue editor')
  const [editing, setEditing] = React.useState(false)

  React.useEffect(() => {
    // If we just started editing, focus the newly rendered input
    if (editing) inputRef.current?.focus()
  }, [editing])

  useFocusTrap({containerRef, disabled: !overlayOpen, initialFocusRef: buttonRef, returnFocusRef: linkRef})

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
      {(overlayOpen || open) && (
        <Overlay
          height="auto"
          width="auto"
          onEscape={() => setOverlayOpen(false)}
          onClickOutside={() => setOverlayOpen(false)}
          returnFocusRef={linkRef}
          top={0}
          left="calc(100vw - 350px)"
          role={role}
          aria-modal={role === 'dialog' ? 'true' : undefined}
          aria-label={role === 'dialog' ? 'Draft issue editor' : undefined}
          ref={containerRef}
        >
          <div className={classes.IssueEditorContainer}>
            <div className={classes.IssueHeader}>
              <Label size="large">
                <IssueDraftIcon /> Draft
              </Label>
              <Text fontSize={1}>opened 2 days ago,</Text>
              <Text fontSize={1}>showing {editing ? 'input' : 'button'}</Text>
            </div>
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
                className={classes.IssueTitleInput}
              />
            ) : (
              <Button
                variant="invisible"
                ref={buttonRef}
                onClick={() => setEditing(true)}
                aria-label="Change issue title"
                sx={{
                  width: '100%',
                  fontSize: 3,
                  color: 'fg.default',
                  p: 2,
                  textAlign: 'left',
                  borderRadius: '2',
                }}
              >
                {title}
              </Button>
            )}
          </div>
        </Overlay>
      )}
    </>
  )
}

export const PositionedOverlays = ({right, role, open}: Args) => {
  const [isOpen, setIsOpen] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right'>(right ? 'right' : 'left')
  const buttonRef = useRef<HTMLButtonElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const closeOverlay = () => setIsOpen(false)

  const containerRef = useRef<HTMLDivElement>(null)

  useFocusTrap({
    containerRef,
    disabled: !isOpen,
  })

  return (
    <div ref={anchorRef}>
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
      {isOpen || open ? (
        direction === 'left' ? (
          <Overlay
            initialFocusRef={confirmButtonRef}
            returnFocusRef={buttonRef}
            ignoreClickRefs={[buttonRef]}
            onEscape={closeOverlay}
            onClickOutside={closeOverlay}
            width="auto"
            anchorSide="inside-right"
            role={role}
            aria-modal={role === 'dialog' ? 'true' : undefined}
            aria-label={role === 'dialog' ? 'Left aligned overlay' : undefined}
            ref={containerRef}
          >
            <div className={classes.ResponsiveWidthContainer}>
              <div className={classes.OverlayFullHeight}>
                <IconButton
                  aria-label="Close"
                  onClick={closeOverlay}
                  icon={XIcon}
                  variant="invisible"
                  className={classes.CloseButtonLeft}
                />
                <Text>Look! left aligned</Text>
              </div>
            </div>
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
            role={role}
            aria-modal={role === 'dialog' ? 'true' : undefined}
            aria-label={role === 'dialog' ? 'Right aligned overlay' : undefined}
            ref={containerRef}
          >
            <div className={classes.ResponsiveWidthContainer}>
              <div className={classes.OverlayFullHeight}>
                <IconButton
                  aria-label="Close"
                  onClick={closeOverlay}
                  icon={XIcon}
                  variant="invisible"
                  className={classes.CloseButtonRight}
                />
                <Text>Look! right aligned</Text>
              </div>
            </div>
          </Overlay>
        )
      ) : null}
    </div>
  )
}
