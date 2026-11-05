'use client'

import React from 'react'

/** The nearest `BaseStyles` element, so portaled popups inherit its theme and typography. */
export const PortalRootContext = React.createContext<HTMLElement | null>(null)

const subscribe = () => () => {}
const getDocumentPortalRoot = () => document.querySelector<HTMLElement>('[data-portal-root]') ?? document.body
const getServerPortalRoot = () => null

/** Resolves the default portal container: the nearest `BaseStyles`, then the first one in the document, then `<body>`. */
export function usePortalRoot(): HTMLElement | null {
  const contextRoot = React.useContext(PortalRootContext)
  const documentRoot = React.useSyncExternalStore(subscribe, getDocumentPortalRoot, getServerPortalRoot)
  return contextRoot ?? documentRoot
}

/** Keeps an explicit container (including `null`) and otherwise falls back to the default portal root. */
export function usePortalContainer<T>(container: T | undefined): T | HTMLElement | undefined {
  const portalRoot = usePortalRoot()
  return container === undefined ? (portalRoot ?? undefined) : container
}
