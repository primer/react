import type {Meta} from '@storybook/react-vite'
import React, {useState} from 'react'

import {Button} from '../Button'
import {AnchoredOverlay} from '.'
import {Stack} from '../Stack'
import {Dialog, Spinner} from '..'

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
