// @vitest-environment node
import {renderToString} from 'react-dom/server'
import {describe, expect, it} from 'vitest'
import {RelativeTime} from './RelativeTime'

describe('RelativeTime on the server', () => {
  const date = new Date('2024-06-02T00:05:00.000Z')

  it('uses a deterministic UTC fallback without reading the document', () => {
    expect(typeof document).toBe('undefined')
    const markup = renderToString(<RelativeTime date={date} />)

    expect(markup).toContain(date.toISOString())
    expect(markup).toMatch(/datetime="2024-06-02T00:05:00.000Z"/i)
  })

  it('keeps the deterministic fallback when formatting overrides are provided', () => {
    const markup = renderToString(
      <RelativeTime
        date={date}
        format="datetime"
        weekday=""
        year="numeric"
        hour="numeric"
        minute="2-digit"
        lang="fr"
        timeZone="UTC"
        hourCycle="h24"
      />,
    )
    expect(markup).toContain('lang="fr"')
    expect(markup).toContain(date.toISOString())
  })

  it('surfaces an invalid explicit time zone during server rendering', () => {
    expect(() => renderToString(<RelativeTime date={date} timeZone="Not/A_Zone" />)).toThrow(RangeError)
  })
})
