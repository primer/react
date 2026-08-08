import {useState, useRef, useCallback} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {DialogParts} from './Dialog'
import {Button} from '../../Button'
import Text from '../../Text'

/**
 * Layer 2 — Parts stories.
 *
 * These demonstrate the compound component API: `DialogParts.Root`, `DialogParts.Content`,
 * `DialogParts.Header`, `DialogParts.Title`, `DialogParts.Subtitle`, `DialogParts.Body`,
 * `DialogParts.Footer`, and `DialogParts.CloseButton`.
 */
const meta: Meta = {
  title: 'Experimental/Dialog/Parts',
  parameters: {
    controls: {expanded: true},
  },
}

export default meta

const lipsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sollicitudin mauris maximus elit sagittis, nec lobortis ligula elementum. Nam iaculis, urna nec lobortis posuere, eros urna venenatis eros, vel accumsan turpis nunc vitae enim.'

// --- Default ---

export const Default: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const onClose = useCallback(() => setOpen(false), [])

    return (
      <>
        <Button ref={buttonRef} onClick={() => setOpen(true)}>
          Open Parts dialog
        </Button>

        <DialogParts open={open} onClose={onClose} returnFocusRef={buttonRef}>
          <DialogParts.Content>
            <DialogParts.Header>
              <DialogParts.Title>Parts Dialog</DialogParts.Title>
              <DialogParts.CloseButton />
            </DialogParts.Header>
            <DialogParts.Subtitle>Built with compound components</DialogParts.Subtitle>
            <DialogParts.Body>
              <Text as="p">{lipsum}</Text>
            </DialogParts.Body>
            <DialogParts.Footer>
              <Button onClick={onClose}>Cancel</Button>
              <Button variant="primary" onClick={onClose}>
                Save
              </Button>
            </DialogParts.Footer>
          </DialogParts.Content>
        </DialogParts>
      </>
    )
  },
}

// --- Sizes ---

export const Small: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false)
    const onClose = useCallback(() => setOpen(false), [])

    return (
      <>
        <Button onClick={() => setOpen(true)}>Small dialog</Button>
        <DialogParts open={open} onClose={onClose}>
          <DialogParts.Content width="small">
            <DialogParts.Header>
              <DialogParts.Title>Small</DialogParts.Title>
              <DialogParts.CloseButton />
            </DialogParts.Header>
            <DialogParts.Body>
              <Text as="p">A compact 296px dialog.</Text>
            </DialogParts.Body>
          </DialogParts.Content>
        </DialogParts>
      </>
    )
  },
}

export const Large: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false)
    const onClose = useCallback(() => setOpen(false), [])

    return (
      <>
        <Button onClick={() => setOpen(true)}>Large dialog</Button>
        <DialogParts open={open} onClose={onClose}>
          <DialogParts.Content width="large" height="large">
            <DialogParts.Header>
              <DialogParts.Title>Large</DialogParts.Title>
              <DialogParts.CloseButton />
            </DialogParts.Header>
            <DialogParts.Body>
              <Text as="p">A 480×640 dialog with fixed height.</Text>
              <Text as="p">{lipsum}</Text>
              <Text as="p">{lipsum}</Text>
            </DialogParts.Body>
            <DialogParts.Footer>
              <Button variant="primary" onClick={onClose}>
                Done
              </Button>
            </DialogParts.Footer>
          </DialogParts.Content>
        </DialogParts>
      </>
    )
  },
}

// --- Positions ---

export const PositionRight: StoryObj = {
  name: 'Position: Right (side sheet)',
  render: () => {
    const [open, setOpen] = useState(false)
    const onClose = useCallback(() => setOpen(false), [])

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open right sheet</Button>
        <DialogParts open={open} onClose={onClose} closeOnBackdropClick>
          <DialogParts.Content position="right" width="large">
            <DialogParts.Header>
              <DialogParts.Title>Side Sheet</DialogParts.Title>
              <DialogParts.CloseButton />
            </DialogParts.Header>
            <DialogParts.Body>
              <Text as="p">This dialog slides in from the right edge, full height.</Text>
            </DialogParts.Body>
          </DialogParts.Content>
        </DialogParts>
      </>
    )
  },
}

export const PositionLeft: StoryObj = {
  name: 'Position: Left (side sheet)',
  render: () => {
    const [open, setOpen] = useState(false)
    const onClose = useCallback(() => setOpen(false), [])

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open left sheet</Button>
        <DialogParts open={open} onClose={onClose} closeOnBackdropClick>
          <DialogParts.Content position="left" width="large">
            <DialogParts.Header>
              <DialogParts.Title>Left Sheet</DialogParts.Title>
              <DialogParts.CloseButton />
            </DialogParts.Header>
            <DialogParts.Body>
              <Text as="p">Slides in from the left edge.</Text>
            </DialogParts.Body>
          </DialogParts.Content>
        </DialogParts>
      </>
    )
  },
}

export const ResponsivePosition: StoryObj = {
  name: 'Responsive: center → fullscreen on narrow',
  render: () => {
    const [open, setOpen] = useState(false)
    const onClose = useCallback(() => setOpen(false), [])

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open responsive dialog</Button>
        <DialogParts open={open} onClose={onClose}>
          <DialogParts.Content position={{regular: 'center', narrow: 'fullscreen'}}>
            <DialogParts.Header>
              <DialogParts.Title>Responsive</DialogParts.Title>
              <DialogParts.CloseButton />
            </DialogParts.Header>
            <DialogParts.Body>
              <Text as="p">Center on desktop, fullscreen on narrow viewports. Resize to see.</Text>
            </DialogParts.Body>
            <DialogParts.Footer>
              <Button variant="primary" onClick={onClose}>
                OK
              </Button>
            </DialogParts.Footer>
          </DialogParts.Content>
        </DialogParts>
      </>
    )
  },
}

// --- Nested Dialogs ---

export const Nested: StoryObj = {
  render: () => {
    const [firstOpen, setFirstOpen] = useState(false)
    const [secondOpen, setSecondOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setFirstOpen(true)}>Open first dialog</Button>

        <DialogParts open={firstOpen} onClose={() => setFirstOpen(false)}>
          <DialogParts.Content>
            <DialogParts.Header>
              <DialogParts.Title>First Dialog</DialogParts.Title>
              <DialogParts.CloseButton />
            </DialogParts.Header>
            <DialogParts.Body>
              <Text as="p">This is the first dialog. You can open another one on top.</Text>
              <Button onClick={() => setSecondOpen(true)}>Open second dialog</Button>
            </DialogParts.Body>
          </DialogParts.Content>
        </DialogParts>

        <DialogParts open={secondOpen} onClose={() => setSecondOpen(false)}>
          <DialogParts.Content width="small">
            <DialogParts.Header>
              <DialogParts.Title>Second Dialog</DialogParts.Title>
              <DialogParts.CloseButton />
            </DialogParts.Header>
            <DialogParts.Body>
              <Text as="p">Nested dialog with independent scroll lock.</Text>
            </DialogParts.Body>
          </DialogParts.Content>
        </DialogParts>
      </>
    )
  },
}
