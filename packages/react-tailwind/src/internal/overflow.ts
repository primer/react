'use client'

import React from 'react'

type OverflowCallback = (isClipped: boolean) => void
export type ObserveFn = (element: Element, onChange: OverflowCallback) => () => void

/** Provides the shared observer's `observe` function to descendants of an `OverflowObserverProvider`. */
export const OverflowObserverContext = React.createContext<ObserveFn | null>(null)

function isClippedEntry(entry: Pick<IntersectionObserverEntry, 'intersectionRatio' | 'isIntersecting'>) {
  return !entry.isIntersecting || entry.intersectionRatio < 0.95
}

/** Maps observed elements to their callbacks so one observer notification fans out to every subscriber. */
export function createOverflowRegistry() {
  const subscribers = new Map<Element, Set<OverflowCallback>>()
  let observer: IntersectionObserver | null = null

  const observe: ObserveFn = (element, onChange) => {
    let callbacks = subscribers.get(element)
    if (!callbacks) {
      callbacks = new Set()
      subscribers.set(element, callbacks)
      observer?.observe(element)
    }
    callbacks.add(onChange)
    return () => {
      callbacks.delete(onChange)
      if (callbacks.size > 0) return
      subscribers.delete(element)
      observer?.unobserve(element)
    }
  }

  return {
    observe,
    connect(root: Element) {
      observer = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            const isClipped = isClippedEntry(entry)
            for (const callback of subscribers.get(entry.target) ?? []) callback(isClipped)
          }
        },
        {root, threshold: [0, 0.95]},
      )
      for (const element of subscribers.keys()) observer.observe(element)
    },
    disconnect() {
      observer?.disconnect()
      observer = null
      // Without a root nothing can be measured, so subscribers fall back to unclipped.
      for (const callbacks of subscribers.values()) for (const callback of callbacks) callback(false)
    },
  }
}

/**
 * Whether `element` is clipped by the nearest `OverflowObserverProvider` root. Reports `false` without a provider, during
 * SSR, or when `disabled`.
 */
export function useIsClipped(element: Element | null, disabled = false): boolean {
  const observe = React.useContext(OverflowObserverContext)
  const [isClipped, setIsClipped] = React.useState(false)

  React.useEffect(() => {
    if (disabled || element === null || observe === null) return
    return observe(element, setIsClipped)
  }, [disabled, element, observe])

  return !disabled && observe !== null && isClipped
}

/** An item that has overflowed its container, paired with the element that marks its original position. */
export interface OverflowItem<Entry> {
  element: Element
  entry: Entry
}

/** Adds or, with `null`, removes the overflow item registered under `id`. */
export type RegisterOverflowItem<Entry> = (id: string, item: OverflowItem<Entry> | null) => void

function isSameOverflowItem<Entry extends object>(first: OverflowItem<Entry> | undefined, second: OverflowItem<Entry>) {
  if (first === undefined || first.element !== second.element) return false
  const firstEntry = first.entry as Record<string, unknown>
  const secondEntry = second.entry as Record<string, unknown>
  const keys = Object.keys(secondEntry)
  return (
    keys.length === Object.keys(firstEntry).length && keys.every(key => Object.is(firstEntry[key], secondEntry[key]))
  )
}

function compareDocumentOrder<Entry>(
  [, first]: [string, OverflowItem<Entry>],
  [, second]: [string, OverflowItem<Entry>],
) {
  return first.element.compareDocumentPosition(second.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
}

/**
 * Collects the items that overflow a container so it can offer them in a "More" menu. Returns the registered items in
 * document order and a stable `register` function for descendants to pass to `useRegisterOverflowItem`.
 */
export function useOverflowRegistry<Entry extends object>() {
  const [items, setItems] = React.useState<ReadonlyMap<string, OverflowItem<Entry>>>(() => new Map())
  const [register] = React.useState<RegisterOverflowItem<Entry>>(
    () => (id: string, item: OverflowItem<Entry> | null) =>
      setItems(previous => {
        if (item === null ? !previous.has(id) : isSameOverflowItem(previous.get(id), item)) return previous
        const next = new Map(previous)
        if (item === null) next.delete(id)
        else next.set(id, item)
        return next
      }),
  )
  return [Array.from(items).sort(compareDocumentOrder), register] as const
}

/**
 * Registers `entry` with an overflow registry while it is non-null, and unregisters it on unmount. Re-registers after
 * every render so the menu always reflects the item's latest props.
 */
export function useRegisterOverflowItem<Entry extends object>(
  register: RegisterOverflowItem<Entry> | null,
  element: Element | null,
  entry: Entry | null,
) {
  const id = React.useId()
  React.useEffect(() => {
    // eslint-disable-next-line react-you-might-not-need-an-effect/no-pass-data-to-parent -- Descendant registry: the parent can only learn which mounted elements overflow after commit.
    register?.(id, entry !== null && element !== null ? {element, entry} : null)
  })
  React.useEffect(() => () => register?.(id, null), [id, register])
}
