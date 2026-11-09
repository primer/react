import React from 'react'
import {createRoot} from 'react-dom/client'
import {ActionList} from '../src/components/ActionList'

export function Fixture() {
  const [events, setEvents] = React.useState<string[]>([])
  const [activations, setActivations] = React.useState(0)
  function record(name: string, event: React.SyntheticEvent<HTMLElement>) {
    const target = event.target instanceof Element ? event.target.tagName : 'unknown'
    const currentTarget = event.currentTarget.tagName
    setEvents(previous => [...previous, `${name}:${currentTarget}:${target}`])
  }
  return (
    <>
      <ActionList aria-label="Results">
        <ActionList.Item
          role="listitem"
          tabIndex={0}
          className="consumer-static-row"
          description="Owned by octocat"
          trailingVisual="Changes blocked by enterprise"
          onKeyDownCapture={event => record('keyDownCapture', event)}
          onKeyDown={event => record('keyDown', event)}
          onKeyUpCapture={event => record('keyUpCapture', event)}
          onClickCapture={event => record('clickCapture', event)}
          onAuxClickCapture={event => record('auxClickCapture', event)}
          trailingAction={
            <span>
              <button type="button" onClick={() => setActivations(previous => previous + 1)}>
                Open
              </button>
              <a href="#details">Details</a>
            </span>
          }
        >
          Repository
        </ActionList.Item>
      </ActionList>
      <output data-testid="events">{events.join(',')}</output>
      <output data-testid="activations">Button activations: {activations}</output>
    </>
  )
}

function mountFixture() {
  const root = document.getElementById('root')
  if (!root) throw new Error('Static ActionList fixture root not found')
  createRoot(root).render(<Fixture />)
}

mountFixture()
