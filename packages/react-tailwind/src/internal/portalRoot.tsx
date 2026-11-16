'use client'

import React from 'react'
import type {PortalContainer} from '../utils/types/portal'

/** The nearest `BaseStyles` element, so portaled popups inherit its theme and typography. */
export const PortalRootContext = React.createContext<HTMLElement | null>(null)

/** Marks children of a Base UI portal, whose own portal context can contain nested floating layers. */
export const FloatingPortalParentContext = React.createContext(false)

/** Marks a modal whose portal is nested in another Primer floating layer. */
export const NestedModalLayerContext = React.createContext(false)

/**
 * Container supplied by the nearest `BasePortalProvider` (`Portal.Provider`). `undefined` means no provider; a `null`
 * container makes portals wait rather than fall back to the default root.
 */
export const PortalContainerContext = React.createContext<{container: PortalContainer} | undefined>(undefined)

const subscribe = () => () => {}
const getDocumentPortalRoot = () => document.querySelector<HTMLElement>('[data-portal-root]') ?? document.body
const getServerPortalRoot = () => null

/**
 * Resolves the default portal root, ignoring portal providers: the nearest `BaseStyles` element, then the first
 * `[data-portal-root]` in the document, then `document.body`. Returns `null` during SSR and hydration.
 */
export function usePortalRoot(): HTMLElement | null {
  const contextRoot = React.useContext(PortalRootContext)
  const documentRoot = React.useSyncExternalStore(subscribe, getDocumentPortalRoot, getServerPortalRoot)
  return contextRoot ?? documentRoot
}

/**
 * Keeps an explicit container (including `null`), then the nearest `BasePortalProvider` container, and otherwise
 * falls back to the default portal root.
 */
export function usePortalContainer<T>(container: T | undefined): T | PortalContainer | undefined {
  const provided = React.useContext(PortalContainerContext)
  const portalRoot = usePortalRoot()
  if (container !== undefined) return container
  if (provided) return provided.container
  return portalRoot ?? undefined
}

/** Lets nested Base UI portals use their parent portal unless an explicit container is supplied. */
export function useFloatingPortalContainer<T>(container: T | undefined): T | PortalContainer | undefined {
  const nested = React.useContext(FloatingPortalParentContext)
  const resolvedContainer = usePortalContainer(container)
  return nested && container === undefined ? undefined : resolvedContainer
}
