import type {Meta} from '@storybook/react-vite'
import React, {useState} from 'react'

import {Button} from '../Button'
import {AnchoredOverlay} from '.'
import {Stack} from '../Stack'
import {Dialog, Spinner, Text} from '..'

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
        <Text as="p" sx={{fontWeight: 'bold'}}>
          How to test (scrollable container):
        </Text>
        <Text as="p">
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
        </Text>
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
          <Text as="p" sx={{color: 'fg.muted'}}>
            ↓ Scroll down to find the trigger button
          </Text>
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
              <Text as="p">This overlay should stay attached to the button as you scroll.</Text>
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
        <Text as="p" sx={{fontWeight: 'bold'}}>
          How to test (window scroll):
        </Text>
        <Text as="p">
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
        </Text>
      </Stack>

      {/* Spacer to push button below the fold */}
      <div style={{height: '120vh', padding: '16px'}}>
        <Text as="p" sx={{color: 'fg.muted'}}>
          ↓ Scroll down to find the trigger button
        </Text>
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
            <Text as="p">This overlay should stay attached to the button as you scroll the page.</Text>
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
