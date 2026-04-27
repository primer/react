import {useState, useRef, useCallback} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {Dialog} from './Dialog'
import {Button} from '../../Button'
import Text from '../../Text'

/**
 * Layer 2 — Parts stories.
 *
 * These demonstrate the compound component API: `Dialog.Root`, `Dialog.Content`,
 * `Dialog.Header`, `Dialog.Title`, `Dialog.Subtitle`, `Dialog.Body`,
 * `Dialog.Footer`, and `Dialog.CloseButton`.
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

        <Dialog open={open} onClose={onClose} returnFocusRef={buttonRef}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Parts Dialog</Dialog.Title>
              <Dialog.CloseButton />
            </Dialog.Header>
            <Dialog.Subtitle>Built with compound components</Dialog.Subtitle>
            <Dialog.Body>
              <Text as="p">{lipsum}</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button onClick={onClose}>Cancel</Button>
              <Button variant="primary" onClick={onClose}>
                Save
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
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
        <Dialog open={open} onClose={onClose}>
          <Dialog.Content width="small">
            <Dialog.Header>
              <Dialog.Title>Small</Dialog.Title>
              <Dialog.CloseButton />
            </Dialog.Header>
            <Dialog.Body>
              <Text as="p">A compact 296px dialog.</Text>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog>
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
        <Dialog open={open} onClose={onClose}>
          <Dialog.Content width="large" height="large">
            <Dialog.Header>
              <Dialog.Title>Large</Dialog.Title>
              <Dialog.CloseButton />
            </Dialog.Header>
            <Dialog.Body>
              <Text as="p">A 480×640 dialog with fixed height.</Text>
              <Text as="p">{lipsum}</Text>
              <Text as="p">{lipsum}</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="primary" onClick={onClose}>
                Done
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
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
        <Dialog open={open} onClose={onClose} closeOnBackdropClick>
          <Dialog.Content position="right" width="large">
            <Dialog.Header>
              <Dialog.Title>Side Sheet</Dialog.Title>
              <Dialog.CloseButton />
            </Dialog.Header>
            <Dialog.Body>
              <Text as="p">This dialog slides in from the right edge, full height.</Text>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog>
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
        <Dialog open={open} onClose={onClose} closeOnBackdropClick>
          <Dialog.Content position="left" width="large">
            <Dialog.Header>
              <Dialog.Title>Left Sheet</Dialog.Title>
              <Dialog.CloseButton />
            </Dialog.Header>
            <Dialog.Body>
              <Text as="p">Slides in from the left edge.</Text>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog>
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
        <Dialog open={open} onClose={onClose}>
          <Dialog.Content position={{regular: 'center', narrow: 'fullscreen'}}>
            <Dialog.Header>
              <Dialog.Title>Responsive</Dialog.Title>
              <Dialog.CloseButton />
            </Dialog.Header>
            <Dialog.Body>
              <Text as="p">Center on desktop, fullscreen on narrow viewports. Resize to see.</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="primary" onClick={onClose}>
                OK
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
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

        <Dialog open={firstOpen} onClose={() => setFirstOpen(false)}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>First Dialog</Dialog.Title>
              <Dialog.CloseButton />
            </Dialog.Header>
            <Dialog.Body>
              <Text as="p">This is the first dialog. You can open another one on top.</Text>
              <Button onClick={() => setSecondOpen(true)}>Open second dialog</Button>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog>

        <Dialog open={secondOpen} onClose={() => setSecondOpen(false)}>
          <Dialog.Content width="small">
            <Dialog.Header>
              <Dialog.Title>Second Dialog</Dialog.Title>
              <Dialog.CloseButton />
            </Dialog.Header>
            <Dialog.Body>
              <Text as="p">Nested dialog with independent scroll lock.</Text>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog>
      </>
    )
  },
}
