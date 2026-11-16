'use client'

import React from 'react'

type HourCycle = NonNullable<Intl.DateTimeFormatOptions['hourCycle']>

interface FormattingContext {
  language: string | undefined
  documentLanguage: string | undefined
  timeZone: string | undefined
  documentTimeZone: string | undefined
  hourCycle: string | undefined
  defaultLocale: string | undefined
  defaultHourCycle: HourCycle | undefined
  prefersAbsoluteTime: boolean
}

const serverContext: FormattingContext = {
  language: undefined,
  documentLanguage: undefined,
  timeZone: undefined,
  documentTimeZone: undefined,
  hourCycle: undefined,
  defaultLocale: undefined,
  defaultHourCycle: undefined,
  prefersAbsoluteTime: false,
}

const preferenceAttribute = 'data-prefers-absolute-time'
const observedAttributes = ['lang', 'time-zone', 'hour-cycle', preferenceAttribute]

type ObservationRoot = Document | ShadowRoot
type ObservationReason = 'languagechange' | 'mutation'
type ObservationListener = (reason: ObservationReason) => void

interface SharedObserver {
  listeners: Set<ObservationListener>
  onLanguageChange: () => void
  observer: MutationObserver
  window: Window | null
}

const sharedObservers = new WeakMap<Node, SharedObserver>()

function getDefaultFormatting(element: Element) {
  const intl = element.ownerDocument.defaultView?.Intl ?? Intl
  const resolved = new intl.DateTimeFormat(undefined, {hour: 'numeric'}).resolvedOptions()
  return {
    defaultLocale: resolved.locale,
    defaultHourCycle: resolved.hour12 ? ('h12' as const) : ('h23' as const),
  }
}

function getShadowHost(node: Node) {
  const root = node.getRootNode()
  return root.nodeType === 11 && 'host' in root ? (root as ShadowRoot).host : null
}

function getInheritedAttribute(element: Element, attribute: string) {
  const documentValue = element.ownerDocument.documentElement.getAttribute(attribute) || undefined
  for (let current: Element | null = element; current; current = current.parentElement ?? getShadowHost(current)) {
    if (current.hasAttribute(attribute)) return current.getAttribute(attribute) || documentValue
  }
  return documentValue
}

function getObservationRoots(element: Element): ObservationRoot[] {
  const roots: ObservationRoot[] = [element.ownerDocument]
  for (let current: Node = element; ; ) {
    const root = current.getRootNode()
    if (root.nodeType !== 11 || !('host' in root)) break
    roots.push(root as ShadowRoot)
    current = (root as ShadowRoot).host
  }
  return roots
}

function sameRoots(first: ObservationRoot[], second: ObservationRoot[]) {
  return first.length === second.length && first.every((root, index) => root === second[index])
}

function subscribeToRoot(root: ObservationRoot, listener: ObservationListener) {
  let shared = sharedObservers.get(root)
  if (!shared) {
    const ownerDocument = root.nodeType === 9 ? (root as Document) : root.ownerDocument
    if (!ownerDocument) throw new Error('RelativeTime observation roots must belong to a document')
    const Observer = ownerDocument.defaultView?.MutationObserver ?? MutationObserver
    const listeners = new Set<ObservationListener>()
    const notify = (reason: ObservationReason) => {
      for (const current of [...listeners]) current(reason)
    }
    const onLanguageChange = () => notify('languagechange')
    const observer = new Observer(() => notify('mutation'))
    observer.observe(root.nodeType === 9 ? ownerDocument.documentElement : root, {
      attributes: true,
      attributeFilter: observedAttributes,
      childList: true,
      subtree: true,
    })
    const observedWindow = root.nodeType === 9 ? ownerDocument.defaultView : null
    observedWindow?.addEventListener('languagechange', onLanguageChange)
    shared = {listeners, observer, onLanguageChange, window: observedWindow}
    sharedObservers.set(root, shared)
  }

  shared.listeners.add(listener)
  return () => {
    shared.listeners.delete(listener)
    if (shared.listeners.size) return
    shared.observer.disconnect()
    shared.window?.removeEventListener('languagechange', shared.onLanguageChange)
    sharedObservers.delete(root)
  }
}

function sameContext(first: FormattingContext, second: FormattingContext) {
  return (
    first.language === second.language &&
    first.documentLanguage === second.documentLanguage &&
    first.timeZone === second.timeZone &&
    first.documentTimeZone === second.documentTimeZone &&
    first.hourCycle === second.hourCycle &&
    first.defaultLocale === second.defaultLocale &&
    first.defaultHourCycle === second.defaultHourCycle &&
    first.prefersAbsoluteTime === second.prefersAbsoluteTime
  )
}

function createFormattingStore(element: HTMLElement | null) {
  let context = serverContext
  let defaults = element ? getDefaultFormatting(element) : undefined
  let defaultsDocument = element?.ownerDocument

  function getSnapshot() {
    if (!element) return serverContext
    const ownerDocument = element.ownerDocument
    if (defaultsDocument !== ownerDocument) {
      defaults = getDefaultFormatting(element)
      defaultsDocument = ownerDocument
    }
    const root = ownerDocument.documentElement
    const body = ownerDocument.querySelector('body')
    const next: FormattingContext = {
      language: getInheritedAttribute(element, 'lang'),
      documentLanguage: root.getAttribute('lang') || undefined,
      timeZone: getInheritedAttribute(element, 'time-zone'),
      documentTimeZone: root.getAttribute('time-zone') || undefined,
      hourCycle: getInheritedAttribute(element, 'hour-cycle'),
      defaultLocale: defaults?.defaultLocale,
      defaultHourCycle: defaults?.defaultHourCycle,
      prefersAbsoluteTime:
        root.getAttribute(preferenceAttribute) === 'true' || body?.getAttribute(preferenceAttribute) === 'true',
    }
    if (!sameContext(context, next)) context = next
    return context
  }

  function subscribe(onChange: () => void) {
    if (!element) return () => {}
    let roots: ObservationRoot[] = []
    let cleanups: Array<() => void> = []

    const bind = (nextRoots: ObservationRoot[]) => {
      for (const cleanup of cleanups) cleanup()
      roots = nextRoots
      cleanups = roots.map(root => subscribeToRoot(root, handleChange))
    }

    const handleChange = (reason: ObservationReason) => {
      const nextRoots = getObservationRoots(element)
      if (reason === 'languagechange' || defaultsDocument !== element.ownerDocument) {
        defaults = getDefaultFormatting(element)
        defaultsDocument = element.ownerDocument
      }
      if (!sameRoots(roots, nextRoots)) bind(nextRoots)
      onChange()
    }

    bind(getObservationRoots(element))
    return () => {
      for (const cleanup of cleanups) cleanup()
    }
  }

  return {getSnapshot, subscribe}
}

function getServerSnapshot() {
  return serverContext
}

export function useFormattingContext(element: HTMLElement | null) {
  const store = React.useMemo(() => createFormattingStore(element), [element])
  return React.useSyncExternalStore(store.subscribe, store.getSnapshot, getServerSnapshot)
}
