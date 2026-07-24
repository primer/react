export type Viewport = 'narrow' | 'regular' | 'wide'
export type ResponsiveValue<T> = T | Partial<Record<Viewport, T>>

const prefix: Record<Viewport, string> = {
  narrow: '',
  regular: 'md:',
  wide: '2xl:',
}

function isResponsiveObject<T>(value: ResponsiveValue<T> | undefined): value is Partial<Record<Viewport, T>> {
  return typeof value === 'object' && value !== null
}

function valueAt<T>(
  value: ResponsiveValue<T> | undefined,
  viewport: Viewport,
  fallback: ResponsiveValue<T> | undefined,
): T | undefined {
  const fallbackValue = isResponsiveObject(fallback) ? fallback[viewport] : fallback
  if (value === undefined) return fallbackValue
  return isResponsiveObject(value) ? (value[viewport] ?? fallbackValue) : value
}

/**
 * Maps Primer's three viewport ranges to Tailwind's mobile-first utilities.
 * An omitted range uses the component's default rather than inheriting a
 * neighbouring range.
 */
export function responsiveClasses<T extends string | boolean>(
  value: ResponsiveValue<T> | undefined,
  classes: Record<string, string>,
  fallback?: ResponsiveValue<T>,
): string | Array<string | undefined> | undefined {
  if (!isResponsiveObject(value) && !isResponsiveObject(fallback)) {
    const resolved = valueAt(value, 'narrow', fallback)
    return resolved === undefined ? undefined : classes[String(resolved)]
  }

  return (Object.keys(prefix) as Viewport[]).map(viewport => {
    const resolved = valueAt(value, viewport, fallback)
    return resolved === undefined ? undefined : `${prefix[viewport]}${classes[String(resolved)]}`
  })
}
