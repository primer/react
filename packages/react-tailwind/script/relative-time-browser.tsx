import React from 'react'
import {createRoot} from 'react-dom/client'
import {RelativeTime, type RelativeTimeUpdatedEvent} from '../src/components/RelativeTime'

export function Fixture({monthDate}: {monthDate: string}) {
  const [running, setRunning] = React.useState(true)
  return (
    <>
      <RelativeTime
        data-testid="workflow-time"
        datetime="2026-03-01T12:00:00.000Z"
        threshold="PT1H"
        onRelativeTimeUpdated={event => {
          document.body.setAttribute('data-workflow-update-time', String(Date.now()))
          document.body.setAttribute('data-workflow-update-text', event.newText)
        }}
      />
      <RelativeTime
        data-testid="month-time"
        datetime={monthDate}
        onRelativeTimeUpdated={event => {
          document.body.setAttribute('data-month-update-time', String(Date.now()))
          document.body.setAttribute('data-month-update-text', event.newText)
        }}
      />
      <span role="timer" aria-label="Time elapsed in this turn" aria-live="off">
        {running ? <RelativeTime datetime="2026-03-01T12:00:00.000Z" format="elapsed" noTitle /> : 'Completed duration'}
      </span>
      <span role="timer" aria-label="Tool duration" aria-live="off">
        {running ? <RelativeTime datetime="2026-03-01T12:59:00.000Z" format="elapsed" noTitle /> : 'Completed duration'}
      </span>
      <button type="button" onClick={() => setRunning(false)}>
        Complete
      </button>
    </>
  )
}

function RoundingFixture({date}: {date: Date}) {
  const recordUpdate = (type: 'relative' | 'micro', event: RelativeTimeUpdatedEvent) => {
    document.body.setAttribute(`data-${type}-update-time`, String(Date.now()))
    document.body.setAttribute(`data-${type}-update-text`, event.newText)
  }
  return (
    <>
      <RelativeTime
        data-testid="rounded-relative"
        date={date}
        format="relative"
        onRelativeTimeUpdated={event => recordUpdate('relative', event)}
        noTitle
      />
      <RelativeTime
        data-testid="rounded-micro"
        date={date}
        format="micro"
        precision="second"
        onRelativeTimeUpdated={event => recordUpdate('micro', event)}
        noTitle
      />
    </>
  )
}

function mountFixture() {
  const root = document.getElementById('root')
  if (!root) throw new Error('Missing fixture root')
  const params = new URLSearchParams(document.location.search)
  if (params.has('rounded')) {
    const boundary = params.get('boundary') === 'hour' ? 3_295_000 : 115_000
    const past = params.get('rounded') === 'past'
    const distance = past ? boundary - 250 : boundary
    const date = new Date(Date.now() + (past ? -distance : distance))
    createRoot(root).render(<RoundingFixture date={date} />)
    return
  }
  const monthDate = params.get('month') === 'future' ? '2026-04-01T12:00:00.000Z' : '2026-03-02T12:00:00.000Z'
  createRoot(root).render(<Fixture monthDate={monthDate} />)
}

mountFixture()
