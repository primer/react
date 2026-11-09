import {act, cleanup, render, waitFor} from '@testing-library/react'
import {Profiler} from 'react'
import {hydrateRoot} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {RelativeTime} from './RelativeTime'

const now = new Date('2024-06-02T12:00:00.000Z')
const date = new Date('2024-06-02T11:00:00.000Z')
const midnight = new Date('2024-06-02T00:05:00.000Z')
const nativeIntl = Intl
const tokyo12 = {'time-zone': 'Asia/Tokyo', 'hour-cycle': 'h12'}
const utc23 = {'time-zone': 'UTC', 'hour-cycle': 'h23'}
const emptyContext = {'time-zone': '', 'hour-cycle': ''}

const savedAttributes = new Map<Element, Map<string, string | null>>()

function saveAttribute(element: Element, attribute: string) {
  let attributes = savedAttributes.get(element)
  if (!attributes) {
    attributes = new Map()
    savedAttributes.set(element, attributes)
  }
  if (!attributes.has(attribute)) attributes.set(attribute, element.getAttribute(attribute))
}

function setAttribute(element: Element, attribute: string, value: string) {
  saveAttribute(element, attribute)
  element.setAttribute(attribute, value)
}

function relativeText(locale: string) {
  return new nativeIntl.RelativeTimeFormat(locale, {numeric: 'auto', style: 'long'}).format(-1, 'hour')
}

function dateText(locale: string, timeZone: string, hourCycle: Intl.DateTimeFormatOptions['hourCycle'], value = date) {
  return new nativeIntl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
    hourCycle,
  }).format(value)
}

function titleText(locale: string, timeZone: string, hourCycle: Intl.DateTimeFormatOptions['hourCycle'], value = date) {
  return new nativeIntl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone,
    hourCycle,
  }).format(value)
}

function getTime(container: HTMLElement) {
  const element = container.querySelector('time')
  if (!element) throw new Error('Expected RelativeTime to render a time element')
  return element
}

function createIntlWithDefaults(locale: string, timeZone: string) {
  class DateTimeFormat extends nativeIntl.DateTimeFormat {
    constructor(...[locales, options]: ConstructorParameters<typeof Intl.DateTimeFormat>) {
      super(locales ?? locale, {...options, timeZone: options?.timeZone ?? timeZone})
    }
  }
  class RelativeTimeFormat extends nativeIntl.RelativeTimeFormat {
    constructor(...[locales, options]: ConstructorParameters<typeof Intl.RelativeTimeFormat>) {
      super(locales ?? locale, options)
    }
  }
  return new Proxy(nativeIntl, {
    get(target, property, receiver) {
      if (property === 'DateTimeFormat') return DateTimeFormat
      if (property === 'RelativeTimeFormat') return RelativeTimeFormat
      return Reflect.get(target, property, receiver)
    },
  })
}

function createIntlWithDifferentDateFormatting() {
  const DateTimeFormat = new Proxy(nativeIntl.DateTimeFormat, {
    construct(target, args, newTarget) {
      const formatter: Intl.DateTimeFormat = Reflect.construct(target, args, newTarget)
      return new Proxy(formatter, {
        get(instance, property) {
          if (property === 'format') return (value: Date | number) => `${instance.format(value)} (server formatting)`
          const value: unknown = Reflect.get(instance, property, instance)
          return typeof value === 'function' ? value.bind(instance) : value
        },
      })
    },
  })
  return new Proxy(nativeIntl, {
    get(target, property, receiver) {
      if (property === 'DateTimeFormat') return DateTimeFormat
      return Reflect.get(target, property, receiver)
    },
  })
}

beforeEach(() => {
  vi.spyOn(Date, 'now').mockReturnValue(now.getTime())
})

afterEach(() => {
  cleanup()
  for (const [element, attributes] of savedAttributes) {
    for (const [attribute, value] of attributes) {
      if (value === null) element.removeAttribute(attribute)
      else element.setAttribute(attribute, value)
    }
  }
  savedAttributes.clear()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('inherited formatting context', () => {
  it('uses the document language instead of a conflicting runtime language', () => {
    const runtimeLanguage = new nativeIntl.DateTimeFormat().resolvedOptions().locale
    const language = runtimeLanguage.startsWith('en') ? 'de' : 'en'
    setAttribute(document.documentElement, 'lang', language)

    const {container} = render(<RelativeTime date={date} format="relative" tense="past" />)

    expect(getTime(container)).toHaveTextContent(relativeText(language))
    expect(getTime(container)).not.toHaveTextContent(relativeText(runtimeLanguage))
  })

  it('prefers the nearest ancestor language and an explicit time-element language', () => {
    setAttribute(document.documentElement, 'lang', 'en')
    const {container} = render(
      <div lang="fr">
        <RelativeTime date={date} format="relative" tense="past" />
        <RelativeTime date={date} format="relative" tense="past" lang="es" />
      </div>,
    )
    const times = container.querySelectorAll('time')

    expect(times[0]).toHaveTextContent(relativeText('fr'))
    expect(times[1]).toHaveTextContent(relativeText('es'))
    expect(times[1]).toHaveAttribute('lang', 'es')
  })

  it('applies inherited time zone and hour cycle to the visible date, title, and absolute preference', () => {
    const {container, rerender} = render(
      <div lang="en" {...tokyo12}>
        <RelativeTime date={date} format="datetime" weekday="" year="numeric" hour="numeric" minute="2-digit" />
      </div>,
    )
    const time = getTime(container)

    expect(time).toHaveTextContent(dateText('en', 'Asia/Tokyo', 'h12'))
    expect(time).toHaveAttribute('title', titleText('en', 'Asia/Tokyo', 'h12'))

    rerender(
      <div lang="en" {...tokyo12}>
        <RelativeTime date={date} format="relative" prefersAbsoluteTime />
      </div>,
    )
    expect(time).toHaveTextContent(
      `Today ${new nativeIntl.DateTimeFormat('en', {
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
        timeZone: 'Asia/Tokyo',
        hourCycle: 'h12',
      }).format(date)}`,
    )
    expect(time).toHaveAttribute('title', titleText('en', 'Asia/Tokyo', 'h12'))
  })

  it.each(['h11', 'h12', 'h23', 'h24'] as const)('uses explicit %s over ancestor formatting settings', hourCycle => {
    const {container} = render(
      <div lang="fr" {...tokyo12}>
        <RelativeTime
          date={midnight}
          format="datetime"
          weekday=""
          year="numeric"
          hour="numeric"
          minute="2-digit"
          lang="es"
          timeZone="UTC"
          hourCycle={hourCycle}
        />
      </div>,
    )
    const time = getTime(container)

    expect(time).toHaveTextContent(dateText('es', 'UTC', hourCycle, midnight))
    expect(time).toHaveAttribute('title', titleText('es', 'UTC', hourCycle, midnight))
  })

  it('uses the runtime clock preference independently of the inherited language', () => {
    const runtimeHour12 = new nativeIntl.DateTimeFormat(undefined, {hour: 'numeric'}).resolvedOptions().hour12
    const language = runtimeHour12 ? 'fr' : 'en-US'
    const hourCycle = runtimeHour12 ? 'h12' : 'h23'
    const {container} = render(
      <div lang={language} {...{'time-zone': 'UTC'}}>
        <RelativeTime date={date} format="datetime" weekday="" year="numeric" hour="numeric" minute="2-digit" />
      </div>,
    )

    expect(getTime(container)).toHaveTextContent(dateText(language, 'UTC', hourCycle))
  })

  it('falls back to html when the nearest language, zone, or cycle is empty', () => {
    setAttribute(document.documentElement, 'lang', 'en')
    setAttribute(document.documentElement, 'time-zone', 'UTC')
    setAttribute(document.documentElement, 'hour-cycle', 'h23')
    const {container} = render(
      <div lang="fr" {...tokyo12}>
        <div lang="" {...emptyContext}>
          <RelativeTime date={date} format="datetime" weekday="" year="numeric" hour="numeric" minute="2-digit" />
        </div>
      </div>,
    )

    expect(getTime(container)).toHaveTextContent(dateText('en', 'UTC', 'h23'))
    expect(getTime(container)).toHaveAttribute('title', titleText('en', 'UTC', 'h23'))
  })

  it('lets explicit empty language and time-zone values fall back to html, not an intermediate ancestor', () => {
    setAttribute(document.documentElement, 'lang', 'en')
    setAttribute(document.documentElement, 'time-zone', 'UTC')
    const {container} = render(
      <div lang="fr" {...tokyo12}>
        <RelativeTime
          date={date}
          format="datetime"
          weekday=""
          year="numeric"
          hour="numeric"
          minute="2-digit"
          lang=""
          timeZone=""
        />
      </div>,
    )

    expect(getTime(container)).toHaveTextContent(dateText('en', 'UTC', 'h12'))
  })

  it('honors custom context attributes on the time element itself', () => {
    const {container} = render(
      <div lang="fr" {...tokyo12}>
        <RelativeTime
          date={midnight}
          format="datetime"
          weekday=""
          year="numeric"
          hour="numeric"
          minute="2-digit"
          lang="en"
          {...{'time-zone': 'UTC', 'hour-cycle': 'h24'}}
        />
      </div>,
    )

    expect(getTime(container)).toHaveTextContent(dateText('en', 'UTC', 'h24', midnight))
  })

  it('reverts to inherited settings when explicit props are removed', async () => {
    const {container, rerender} = render(
      <div lang="fr" {...tokyo12}>
        <RelativeTime
          date={date}
          format="datetime"
          weekday=""
          year="numeric"
          hour="numeric"
          minute="2-digit"
          lang="en"
          timeZone="UTC"
          hourCycle="h23"
        />
      </div>,
    )
    expect(getTime(container)).toHaveTextContent(dateText('en', 'UTC', 'h23'))

    rerender(
      <div lang="fr" {...tokyo12}>
        <RelativeTime date={date} format="datetime" weekday="" year="numeric" hour="numeric" minute="2-digit" />
      </div>,
    )
    await act(async () => {})
    expect(getTime(container)).toHaveTextContent(dateText('fr', 'Asia/Tokyo', 'h12'))
  })

  it('falls back safely for invalid inherited values, then uses html context when they are removed', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const runtime = new nativeIntl.DateTimeFormat(undefined, {hour: 'numeric'}).resolvedOptions()
    const hourCycle = runtime.hour12 ? 'h12' : 'h23'
    setAttribute(document.documentElement, 'lang', 'en-US')
    setAttribute(document.documentElement, 'time-zone', 'UTC')
    setAttribute(document.documentElement, 'hour-cycle', 'h23')
    const {container, getByTestId} = render(
      <div data-testid="context" lang="not_a_language" {...{'time-zone': 'Not/A_Timezone', 'hour-cycle': 'invalid'}}>
        <RelativeTime date={date} format="datetime" weekday="" year="numeric" hour="numeric" minute="2-digit" />
      </div>,
    )
    const parent = getByTestId('context')
    const time = getTime(container)

    expect(time).toHaveTextContent(dateText(runtime.locale, runtime.timeZone, hourCycle))
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('not_a_language'))
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('invalid'))
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Not/A_Timezone'))

    parent.removeAttribute('lang')
    parent.removeAttribute('time-zone')
    parent.removeAttribute('hour-cycle')
    await waitFor(() => expect(time).toHaveTextContent(dateText('en-US', 'UTC', 'h23')))
  })

  it('responds to runtime language changes when no language is inherited', async () => {
    setAttribute(document.documentElement, 'lang', '')
    vi.stubGlobal('Intl', createIntlWithDefaults('fr-FR', 'UTC'))
    const {container} = render(<RelativeTime date={date} format="relative" tense="past" />)
    const time = getTime(container)
    expect(time).toHaveTextContent(relativeText('fr'))

    vi.stubGlobal('Intl', createIntlWithDefaults('de-DE', 'UTC'))
    await act(async () => window.dispatchEvent(new Event('languagechange')))
    expect(time).toHaveTextContent(relativeText('de'))
  })

  it('updates mounted static output and callback when inherited attributes change', async () => {
    const onRelativeTimeUpdated = vi.fn()
    const {container} = render(
      <div lang="en" {...utc23}>
        <RelativeTime
          date={date}
          format="datetime"
          weekday=""
          year="numeric"
          hour="numeric"
          minute="2-digit"
          onRelativeTimeUpdated={onRelativeTimeUpdated}
        />
      </div>,
    )
    const ancestor = container.firstElementChild
    if (!ancestor) throw new Error('Expected a formatting ancestor')
    const time = getTime(container)
    const before = dateText('en', 'UTC', 'h23')
    expect(time).toHaveTextContent(before)
    onRelativeTimeUpdated.mockClear()

    await act(async () => {
      ancestor.setAttribute('lang', 'fr')
      ancestor.setAttribute('time-zone', 'Asia/Tokyo')
      ancestor.setAttribute('hour-cycle', 'h12')
    })

    const after = dateText('fr', 'Asia/Tokyo', 'h12')
    expect(time).toHaveTextContent(after)
    expect(time).toHaveAttribute('title', titleText('fr', 'Asia/Tokyo', 'h12'))
    expect(onRelativeTimeUpdated).toHaveBeenLastCalledWith(expect.objectContaining({oldText: before, newText: after}))
  })

  it('tracks a moved element and subsequent changes to its new ancestors', async () => {
    const first = document.createElement('div')
    const second = document.createElement('div')
    const container = document.createElement('div')
    first.lang = 'fr'
    second.lang = 'de'
    first.append(container)
    document.body.append(first, second)
    const {unmount} = render(<RelativeTime date={date} format="relative" tense="past" />, {container})
    const time = getTime(container)

    try {
      expect(time).toHaveTextContent(relativeText('fr'))
      await act(async () => second.append(container))
      expect(time).toHaveTextContent(relativeText('de'))
      await act(async () => {
        second.lang = 'es'
      })
      expect(time).toHaveTextContent(relativeText('es'))
    } finally {
      unmount()
      first.remove()
      second.remove()
    }
  })

  it('uses the time element owner document rather than the global document', () => {
    setAttribute(document.documentElement, 'lang', 'de')
    const ownerDocument = document.implementation.createHTMLDocument('RelativeTime')
    ownerDocument.documentElement.setAttribute('lang', 'fr')
    ownerDocument.documentElement.setAttribute('time-zone', 'UTC')
    ownerDocument.documentElement.setAttribute('hour-cycle', 'h23')
    const {container} = render(
      <RelativeTime date={date} format="datetime" weekday="" year="numeric" hour="numeric" minute="2-digit" />,
      {container: ownerDocument.body},
    )

    expect(getTime(container).textContent).toBe(dateText('fr', 'UTC', 'h23'))
  })

  it('reads the absolute-time preference from the owner document', async () => {
    setAttribute(document.body, 'data-prefers-absolute-time', 'true')
    const ownerDocument = document.implementation.createHTMLDocument('RelativeTime')
    ownerDocument.documentElement.setAttribute('lang', 'fr')
    ownerDocument.documentElement.setAttribute('time-zone', 'UTC')
    ownerDocument.documentElement.setAttribute('hour-cycle', 'h23')
    const {container} = render(<RelativeTime date={date} format="relative" tense="past" />, {
      container: ownerDocument.body,
    })
    const time = getTime(container)
    expect(time.textContent).toBe(relativeText('fr'))

    await act(async () => {
      ownerDocument.body.setAttribute('data-prefers-absolute-time', 'true')
    })
    const today = new nativeIntl.RelativeTimeFormat('fr', {numeric: 'auto'}).format(0, 'day')
    const timeOnly = new nativeIntl.DateTimeFormat('fr', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
      timeZone: 'UTC',
      hourCycle: 'h23',
    }).format(date)
    expect(time.textContent).toBe(`${today.charAt(0).toLocaleUpperCase('fr')}${today.slice(1)} ${timeOnly}`)
  })

  it('uses and follows the owner document when a mounted subtree moves to an iframe', async () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    const ownerDocument = iframe.contentDocument
    if (!ownerDocument) throw new Error('Expected the iframe to have a document')
    ownerDocument.documentElement.setAttribute('lang', 'de-DE')
    ownerDocument.documentElement.setAttribute('time-zone', 'Europe/Berlin')
    ownerDocument.documentElement.setAttribute('hour-cycle', 'h23')
    const host = document.createElement('div')
    document.body.append(host)
    const updated = vi.fn()
    const {container, unmount} = render(
      <RelativeTime
        date={date}
        format="datetime"
        weekday=""
        year="numeric"
        hour="numeric"
        minute="2-digit"
        onRelativeTimeUpdated={updated}
      />,
      {container: host},
    )
    const time = getTime(container)

    try {
      ownerDocument.body.append(host)
      await waitFor(() => expect(time.textContent).toBe(dateText('de-DE', 'Europe/Berlin', 'h23')))
      expect(updated.mock.lastCall?.[0]).toBeInstanceOf(ownerDocument.defaultView?.Event)

      ownerDocument.body.setAttribute('data-prefers-absolute-time', 'true')
      await waitFor(() => expect(time.textContent).not.toBe(dateText('de-DE', 'Europe/Berlin', 'h23')))
      ownerDocument.body.removeAttribute('data-prefers-absolute-time')
      await waitFor(() => expect(time.textContent).toBe(dateText('de-DE', 'Europe/Berlin', 'h23')))
    } finally {
      unmount()
      host.remove()
      iframe.remove()
    }
  })

  it('tracks shadow-root context and the owner document after the host moves', async () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    const ownerDocument = iframe.contentDocument
    if (!ownerDocument) throw new Error('Expected the iframe to have a document')
    ownerDocument.documentElement.setAttribute('lang', 'fr-FR')
    ownerDocument.documentElement.setAttribute('time-zone', 'Asia/Tokyo')
    ownerDocument.documentElement.setAttribute('hour-cycle', 'h12')
    const host = document.createElement('div')
    host.setAttribute('lang', 'es-ES')
    host.setAttribute('time-zone', 'America/Mexico_City')
    host.setAttribute('hour-cycle', 'h12')
    document.body.append(host)
    const shadow = host.attachShadow({mode: 'open'})
    const shadowContainer = document.createElement('div')
    shadowContainer.setAttribute('lang', 'de-DE')
    shadowContainer.setAttribute('time-zone', 'Europe/Berlin')
    shadowContainer.setAttribute('hour-cycle', 'h23')
    shadow.append(shadowContainer)
    const {container, unmount} = render(
      <RelativeTime date={date} format="datetime" weekday="" year="numeric" hour="numeric" minute="2-digit" />,
      {container: shadowContainer},
    )
    const time = getTime(container)

    try {
      expect(time).toHaveTextContent(dateText('de-DE', 'Europe/Berlin', 'h23'))
      shadowContainer.removeAttribute('lang')
      shadowContainer.removeAttribute('time-zone')
      shadowContainer.removeAttribute('hour-cycle')
      await waitFor(() => expect(time).toHaveTextContent(dateText('es-ES', 'America/Mexico_City', 'h12')))
      host.setAttribute('lang', 'ja-JP')
      host.setAttribute('time-zone', 'Asia/Tokyo')
      host.setAttribute('hour-cycle', 'h23')
      await waitFor(() => expect(time).toHaveTextContent(dateText('ja-JP', 'Asia/Tokyo', 'h23')))
      host.removeAttribute('lang')
      host.removeAttribute('time-zone')
      host.removeAttribute('hour-cycle')
      ownerDocument.body.append(host)
      await waitFor(() => expect(time.textContent).toBe(dateText('fr-FR', 'Asia/Tokyo', 'h12')))
      shadowContainer.setAttribute('lang', 'en-GB')
      await waitFor(() => expect(time.textContent).toBe(dateText('en-GB', 'Asia/Tokyo', 'h12')))
    } finally {
      unmount()
      host.remove()
      iframe.remove()
    }
  })

  it('shares an observer and ignores unrelated DOM changes for many timestamps', async () => {
    const observe = vi.spyOn(MutationObserver.prototype, 'observe')
    const renders = vi.fn()
    const unrelated = document.createElement('div')
    document.body.append(unrelated)
    try {
      const {getAllByTestId, unmount} = render(
        <Profiler id="timestamps" onRender={renders}>
          <div>
            {Array.from({length: 100}, (_, index) => (
              <RelativeTime key={index} date={date} format="datetime" data-testid="timestamp" />
            ))}
          </div>
        </Profiler>,
      )
      await waitFor(() => expect(getAllByTestId('timestamp')[0]).toHaveAttribute('title'))
      const timeObservers = observe.mock.calls
        .map(([, options], index) => ({
          options,
          observer: observe.mock.instances[index] as MutationObserver,
        }))
        .filter(({options}) => options?.attributeFilter?.includes('time-zone'))
      expect(timeObservers).toHaveLength(1)
      const disconnect = vi.spyOn(timeObservers[0]!.observer, 'disconnect')
      renders.mockClear()
      await act(async () => {
        unrelated.setAttribute('lang', 'fr-FR')
      })
      expect(renders).not.toHaveBeenCalled()
      unmount()
      expect(disconnect).toHaveBeenCalledTimes(1)
    } finally {
      unrelated.remove()
    }
  })

  it('hydrates without a mismatch when server and browser Intl defaults conflict', async () => {
    setAttribute(document.documentElement, 'lang', 'en')
    const app = <RelativeTime date={date} format="relative" tense="past" />
    const container = document.createElement('div')
    document.body.append(container)
    vi.stubGlobal('Intl', createIntlWithDefaults('fr-FR', 'America/New_York'))
    container.innerHTML = renderToString(app)
    const serverTime = getTime(container)
    const serverText = serverTime.textContent

    vi.stubGlobal('Intl', createIntlWithDefaults('de-DE', 'Asia/Tokyo'))
    const onRecoverableError = vi.fn()
    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      await act(async () => {
        root = hydrateRoot(container, app, {onRecoverableError})
      })

      expect(serverText).toBeTruthy()
      expect(getTime(container)).toBe(serverTime)
      expect(serverTime).toHaveTextContent(relativeText('en'))
      expect(onRecoverableError).not.toHaveBeenCalled()
    } finally {
      await act(async () => root?.unmount())
      container.remove()
    }
  })

  it('hydrates across different Intl formatting implementations with explicit overrides', async () => {
    const app = (
      <RelativeTime
        date={date}
        format="datetime"
        weekday=""
        year="numeric"
        hour="numeric"
        minute="2-digit"
        lang="en"
        timeZone="UTC"
        hourCycle="h12"
      />
    )
    const container = document.createElement('div')
    document.body.append(container)
    vi.stubGlobal('Intl', createIntlWithDifferentDateFormatting())
    expect(new Intl.DateTimeFormat('en').format(date)).toContain('(server formatting)')
    container.innerHTML = renderToString(app)
    const serverTime = getTime(container)
    expect(serverTime).toHaveTextContent(date.toISOString())

    vi.stubGlobal('Intl', nativeIntl)
    const onRecoverableError = vi.fn()
    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      await act(async () => {
        root = hydrateRoot(container, app, {onRecoverableError})
      })

      expect(getTime(container)).toBe(serverTime)
      expect(serverTime).toHaveTextContent(dateText('en', 'UTC', 'h12'))
      expect(onRecoverableError).not.toHaveBeenCalled()
    } finally {
      await act(async () => root?.unmount())
      container.remove()
    }
  })

  it('hydrates an offsetless datetime before interpreting it in the client time zone', async () => {
    const datetime = '2026-06-15T12:34:56'
    const container = document.createElement('div')
    const time = document.createElement('time')
    time.setAttribute('datetime', datetime)
    time.setAttribute('data-component', 'RelativeTime')
    time.textContent = datetime
    container.append(time)
    document.body.append(container)
    const onRecoverableError = vi.fn()
    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      await act(async () => {
        root = hydrateRoot(container, <RelativeTime datetime={datetime} />, {onRecoverableError})
      })
      await waitFor(() => expect(time.textContent).not.toBe(datetime))
      expect(time).toHaveAttribute('datetime', new Date(datetime).toISOString())
      expect(onRecoverableError).not.toHaveBeenCalled()
    } finally {
      await act(async () => root?.unmount())
      container.remove()
    }
  })
})
