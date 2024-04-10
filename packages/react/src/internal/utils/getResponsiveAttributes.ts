import type {ResponsiveValue} from '../../hooks/useResponsiveValue'

export function getResponsiveAttributes<T>(property: string, values?: T | ResponsiveValue<T>) {
  if (!values) {
    return undefined
  }

  if (typeof values === 'string') {
    return {
      [`data-${property}`]: values,
    }
  }

  if (typeof values === 'boolean' && values) {
    return {
      [`data-${property}`]: '',
    }
  }

  return Object.fromEntries(
    Object.entries(values)
      .filter(([_key, value]) => {
        if (typeof value === 'boolean') {
          return value
        }
        return true
      })
      .map(([key, value]) => {
        if (typeof value === 'boolean' && value) {
          return [`data-${property}-${key}`, '']
        }
        return [`data-${property}-${key}`, value]
      }),
  )
}
