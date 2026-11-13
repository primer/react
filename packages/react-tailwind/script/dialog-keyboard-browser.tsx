import {Dialog as BaseDialog} from '@base-ui/react/dialog'
import React from 'react'
import {createRoot} from 'react-dom/client'
import {Dialog} from '../src/components/Dialog'

interface KeyRecord {
  scope: 'inside' | 'popup' | 'outside'
  key: string
  defaultPrevented: boolean
  nativeEventId: number
}

const nativeEvents = new WeakMap<Event, number>()
let nextEventId = 0

function getNativeEventId(event: Event): number {
  const existingId = nativeEvents.get(event)
  if (existingId !== undefined) return existingId
  const id = nextEventId
  nextEventId += 1
  nativeEvents.set(event, id)
  return id
}

export function Fixture({mode}: {mode: string | null}) {
  const [events, setEvents] = React.useState<KeyRecord[]>([])
  const [activeResult, setActiveResult] = React.useState(0)
  const [submissions, setSubmissions] = React.useState(0)
  const modal = mode === 'non-modal' ? false : mode === 'trap-focus' ? 'trap-focus' : true
  const record =
    (scope: KeyRecord['scope']) =>
    (event: React.KeyboardEvent<HTMLElement>): void => {
      const {key, defaultPrevented} = event
      const nativeEventId = getNativeEventId(event.nativeEvent)
      setEvents(previous => [...previous, {scope, key, defaultPrevented, nativeEventId}])
    }

  const children = (
    <>
      <Dialog.Title>Search</Dialog.Title>
      <Dialog.Body
        onKeyDown={event => {
          record('inside')(event)
          if (mode === 'command' && event.key === 'ArrowDown') {
            event.preventDefault()
            setActiveResult(current => current + 1)
          }
          if (mode === 'command' && event.key === 'Enter') {
            event.preventDefault()
            setSubmissions(current => current + 1)
          }
        }}
      >
        <label htmlFor="search-terms">Search terms</label>
        <input id="search-terms" defaultValue="primer" />
        {mode === 'command' && (
          <span data-testid="commands">
            {activeResult}:{submissions}
          </span>
        )}
      </Dialog.Body>
    </>
  )

  return (
    // This wrapper observes bubbled events; it is not itself interactive.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div onKeyDown={record('outside')}>
      {mode === 'raw' ? (
        <BaseDialog.Root modal={modal}>
          <BaseDialog.Trigger>Open search</BaseDialog.Trigger>
          <BaseDialog.Portal>
            <BaseDialog.Popup onKeyDown={record('popup')}>{children}</BaseDialog.Popup>
          </BaseDialog.Portal>
        </BaseDialog.Root>
      ) : (
        <Dialog.Root modal={modal}>
          <Dialog.Trigger>Open search</Dialog.Trigger>
          {mode === 'popup' ? (
            <Dialog.Portal>
              <Dialog.Viewport>
                <Dialog.Popup onKeyDown={record('popup')}>{children}</Dialog.Popup>
              </Dialog.Viewport>
            </Dialog.Portal>
          ) : (
            <Dialog.Content onKeyDown={record('popup')} portal={mode !== 'inline'}>
              {children}
            </Dialog.Content>
          )}
        </Dialog.Root>
      )}
      <span data-testid="key-log" hidden>
        {JSON.stringify(events)}
      </span>
    </div>
  )
}

function mountFixture() {
  const root = document.getElementById('root')
  if (!root) throw new Error('Dialog keyboard fixture root not found')
  const mode = new URLSearchParams(window.location.search).get('mode')
  createRoot(root).render(<Fixture mode={mode} />)
}

mountFixture()
