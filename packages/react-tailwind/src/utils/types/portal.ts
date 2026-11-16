import type React from 'react'

/**
 * A portal destination: an element or shadow root, a ref to one, or `null` to wait for a destination instead of
 * falling back to the default portal root. Refs are read after commit.
 */
export type PortalContainer = HTMLElement | ShadowRoot | React.RefObject<HTMLElement | ShadowRoot | null> | null
