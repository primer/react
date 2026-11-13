export type Viewport = 'narrow' | 'regular' | 'wide'

/** A value that may vary across Primer's narrow, regular, and wide ranges. */
export type ResponsiveValue<T> = T | Partial<Record<Viewport, T>>
