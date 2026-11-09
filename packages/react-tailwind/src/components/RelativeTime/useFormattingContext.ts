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

function getDefaultFormatting() {
  const resolved = new Intl.DateTimeFormat(undefined, {hour: 'numeric'}).resolvedOptions()
  return {
    defaultLocale: resolved.locale,
    defaultHourCycle: resolved.hour12 ? ('h12' as const) : ('h23' as const),
  }
}

function getInheritedAttribute(element: Element, attribute: string) {
  return (
    element.closest(`[${attribute}]`)?.getAttribute(attribute) ||
    element.ownerDocument.documentElement.getAttribute(attribute) ||
    undefined
  )
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
  let defaults = element ? getDefaultFormatting() : undefined

  function getSnapshot() {
    if (!element) return serverContext
    const ownerDocument = element.ownerDocument
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
    const observedElement = element

    let observedWindow: Window | null = null
    const onLanguageChange = () => {
      defaults = getDefaultFormatting()
      onChange()
    }
    const observer = new MutationObserver(records => {
      const ancestryChanged = records.some(
        record =>
          record.type === 'childList' &&
          [...record.addedNodes, ...record.removedNodes].some(
            node => node === observedElement || node.contains(observedElement),
          ),
      )
      if (ancestryChanged) observeAncestors()
      if (ancestryChanged || records.some(record => record.type === 'attributes')) onChange()
    })

    function observeAncestors() {
      observer.disconnect()
      const ownerDocument = observedElement.ownerDocument
      const targets = new Set<Node>([ownerDocument.documentElement])
      const body = ownerDocument.querySelector('body')
      if (body) targets.add(body)
      for (let node: Node | null = observedElement; node; node = node.parentNode) targets.add(node)
      for (const target of targets) {
        observer.observe(target, {attributes: true, attributeFilter: observedAttributes, childList: true})
      }
      if (observedWindow !== ownerDocument.defaultView) {
        observedWindow?.removeEventListener('languagechange', onLanguageChange)
        observedWindow = ownerDocument.defaultView
        observedWindow?.addEventListener('languagechange', onLanguageChange)
      }
    }

    observeAncestors()
    return () => {
      observer.disconnect()
      observedWindow?.removeEventListener('languagechange', onLanguageChange)
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
