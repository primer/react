import type {ResponsiveValue} from './responsiveTypes'

const types = ['narrow', 'regular', 'wide'] as const

/**
 * Helper utility to get the value for a prop based on control args. This is
 * helpful when an arg can have both responsive values and a plain value. In
 * cases where both are defined, responsive values will take preference
 */
export function getResponsiveControlValues<T>(value: T, responsiveValue: ResponsiveValue<T>) {
  const match = types.some(type => {
    return responsiveValue[type]
  })
  if (match) {
    return responsiveValue
  }
  return value
}
