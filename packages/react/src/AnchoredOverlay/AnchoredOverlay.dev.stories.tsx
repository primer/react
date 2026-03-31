import type {Meta} from '@storybook/react-vite'
import React, {useState, useRef} from 'react'

import {Button} from '../Button'
import {AnchoredOverlay} from '.'
import {Stack} from '../Stack'
import {Dialog, Spinner, ActionList, ActionMenu} from '..'

const meta = {
  title: 'Components/AnchoredOverlay/Dev',
  component: AnchoredOverlay,
} satisfies Meta<typeof AnchoredOverlay>

export default meta

export const RepositionAfterContentGrows = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    window.setTimeout(() => {
      if (open) setLoading(false)
    }, 2000)
  }, [open])

  return (
    <Stack direction="vertical" justify="space-between" style={{height: 'calc(100vh - 200px)'}}>
      <div>
        What to expect:
        <ul>
          <li>The anchored overlay should open below the anchor (default position)</li>
          <li>After 2000ms, the amount of content in the overlay grows</li>
          <li>the overlay should reposition itself above the anchor so that it stays inside the window</li>
        </ul>
      </div>
      <AnchoredOverlay
        renderAnchor={props => (
          <Button {...props} style={{width: 'fit-content'}}>
            Button
          </Button>
        )}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => {
          setOpen(false)
          setLoading(true)
        }}
      >
        {loading ? (
          <>
            <Spinner />
            loading for 2000ms
          </>
        ) : (
          <div style={{height: '300px'}}>content with 300px height</div>
        )}
      </AnchoredOverlay>
    </Stack>
  )
}

export const RepositionAfterContentGrowsWithinDialog = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    window.setTimeout(() => {
      if (open) setLoading(false)
    }, 2000)
  }, [open])

  return (
    <Dialog onClose={() => {}}>
      <Stack direction="vertical" justify="space-between" style={{height: 'calc(100vh - 300px)'}}>
        <div>
          What to expect:
          <ul>
            <li>The anchored overlay should open below the anchor (default position)</li>
            <li>After 2000ms, the amount of content in the overlay grows</li>
            <li>the overlay should reposition itself above the anchor so that it stays inside the window</li>
          </ul>
        </div>
        <AnchoredOverlay
          renderAnchor={props => (
            <Button {...props} style={{width: 'fit-content'}}>
              Button
            </Button>
          )}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => {
            setOpen(false)
            setLoading(true)
          }}
        >
          {loading ? (
            <>
              <Spinner />
              loading for 2000ms
            </>
          ) : (
            <div style={{height: '300px'}}>content with 300px height</div>
          )}
        </AnchoredOverlay>
      </Stack>
    </Dialog>
  )
}

function LazyAnchoredOverlay() {
  const [wasTriggered, setWasTriggered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  if (!wasTriggered) {
    return (
      <Button
        ref={anchorRef}
        onClick={() => {
          setWasTriggered(true)
          setIsOpen(true)
        }}
      >
        Open Overlay (lazy)
      </Button>
    )
  }

  return (
    <AnchoredOverlay
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      renderAnchor={props => (
        <Button {...props} ref={anchorRef}>
          Open Overlay (loaded)
        </Button>
      )}
      anchorRef={anchorRef}
    >
      <ActionList>
        <ActionList.Item onSelect={() => setIsOpen(false)}>Item 1</ActionList.Item>
        <ActionList.Item onSelect={() => setIsOpen(false)}>Item 2</ActionList.Item>
        <ActionList.Item onSelect={() => setIsOpen(false)}>Item 3</ActionList.Item>
      </ActionList>
    </AnchoredOverlay>
  )
}

function LazyActionMenu() {
  const [items, setItems] = useState<string[] | null>(null)

  const loadItems = () => {
    // Simulate expensive data fetch
    if (!items) {
      setItems(['Assignee 1', 'Assignee 2', 'Assignee 3'])
    }
  }

  return (
    <ActionMenu>
      <ActionMenu.Button onClick={loadItems}>{items ? 'Select assignee' : 'Click to load assignees'}</ActionMenu.Button>
      <ActionMenu.Overlay>
        <ActionList>
          {items ? (
            items.map(item => <ActionList.Item key={item}>{item}</ActionList.Item>)
          ) : (
            <ActionList.Item disabled>Loading...</ActionList.Item>
          )}
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  )
}

export const WithAnchoredOverlay = {
  render: () => <LazyAnchoredOverlay />,
  parameters: {
    docs: {
      description: {
        story:
          'Defers mounting AnchoredOverlay until first click. The overlay component (with focus trap, positioning, etc.) is not created until needed.',
      },
    },
  },
}

export const WithActionMenu = {
  render: () => <LazyActionMenu />,
  parameters: {
    docs: {
      description: {
        story: 'Uses ActionMenu but lazily loads the menu items on first open.',
      },
    },
  },
}
