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

export const ScrollRecalculation = () => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Stack gap="normal" style={{padding: '16px', marginBottom: '16px'}}>
        <p style={{fontWeight: 'bold'}}>How to test (scrollable container):</p>
        <p>
          1. Scroll down inside the bordered box until you see the &quot;Open overlay&quot; button
          <br />
          2. Click the button to open the overlay
          <br />
          3. Scroll inside the box again
          <br />
          4. <strong>Expected:</strong> the overlay stays visually attached to the button
          <br />
          5. <strong>Bug (without fix):</strong> the overlay stays at its initial absolute position and detaches from
          the button
        </p>
      </Stack>

      <div
        style={{
          height: '400px',
          overflow: 'auto',
          border: '1px solid var(--borderColor-default, #d1d9e0)',
          borderRadius: 'var(--borderRadius-medium)',
          position: 'relative',
        }}
      >
        {/* Spacer to push button below the fold */}
        <div style={{height: '600px', padding: '16px'}}>
          <p style={{color: 'var(--fgColor-muted)'}}>↓ Scroll down to find the trigger button</p>
        </div>

        <div style={{padding: '16px'}}>
          <AnchoredOverlay
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            renderAnchor={props => <Button {...props}>Open overlay</Button>}
            overlayProps={{
              role: 'dialog',
              'aria-modal': true,
              'aria-label': 'Scroll recalculation demo',
            }}
            focusZoneSettings={{disabled: true}}
            preventOverflow={false}
          >
            <div style={{padding: '16px', width: '240px'}}>
              <p>This overlay should stay attached to the button as you scroll.</p>
            </div>
          </AnchoredOverlay>
        </div>

        {/* Spacer below the button so there's room to scroll further */}
        <div style={{height: '800px'}} />
      </div>
    </div>
  )
}

export const WindowScrollRecalculation = () => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Stack gap="normal" style={{padding: '16px'}}>
        <p style={{fontWeight: 'bold'}}>How to test (window scroll):</p>
        <p>
          1. Scroll down the page until you see the &quot;Open overlay&quot; button
          <br />
          2. Click the button to open the overlay
          <br />
          3. Scroll the page again
          <br />
          4. <strong>Expected:</strong> the overlay stays visually attached to the button
          <br />
          5. <strong>Bug (without fix):</strong> the overlay stays at its initial absolute position and detaches from
          the button
        </p>
      </Stack>

      {/* Spacer to push button below the fold */}
      <div style={{height: '120vh', padding: '16px'}}>
        <p style={{color: 'var(--fgColor-muted)'}}>↓ Scroll down to find the trigger button</p>
      </div>

      <div style={{padding: '16px'}}>
        <AnchoredOverlay
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          renderAnchor={props => <Button {...props}>Open overlay</Button>}
          overlayProps={{
            role: 'dialog',
            'aria-modal': true,
            'aria-label': 'Window scroll recalculation demo',
          }}
          focusZoneSettings={{disabled: true}}
          preventOverflow={false}
        >
          <div style={{padding: '16px', width: '240px'}}>
            <p>This overlay should stay attached to the button as you scroll the page.</p>
          </div>
        </AnchoredOverlay>
      </div>

      {/* Spacer below the button so there's room to scroll further */}
      <div style={{height: '120vh'}} />
    </div>
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

const ManyOverlaysItem = ({index}: {index: number}) => {
  const [open, setOpen] = useState(false)
  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Trigger {index}</Button>}
      overlayProps={{role: 'dialog', 'aria-label': `Overlay ${index}`}}
      focusZoneSettings={{disabled: true}}
    >
      <div style={{padding: '8px', width: '160px'}}>Overlay #{index}</div>
    </AnchoredOverlay>
  )
}

export const ManyOverlays = () => {
  const count = 50
  const items = Array.from({length: count}, (_, i) => i)
  return (
    <div style={{padding: '16px'}}>
      <p>
        Renders {count} <code>AnchoredOverlay</code> instances. Use the per-trigger button to open any subset, or open
        all via <code>document.querySelectorAll(&apos;[aria-haspopup=true]&apos;).forEach(b =&gt; b.click())</code>.
      </p>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, max-content)', gap: '12px'}}>
        {items.map(i => (
          <ManyOverlaysItem key={i} index={i} />
        ))}
      </div>
      {/* Spacer so the page is scrollable */}
      <div style={{height: '120vh'}} />
    </div>
  )
}
