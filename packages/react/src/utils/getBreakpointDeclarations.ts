import type {ResponsiveValue} from '../hooks/useResponsiveValue'

export function areAllValuesTheSame(responsiveValue: ResponsiveValue<boolean | number | string>): boolean {
  if ('narrow' in responsiveValue && 'regular' in responsiveValue && 'wide' in responsiveValue) {
    const values = Object.values(responsiveValue)
    return values.every(value => value === values[0])
  }
  return false
}
export function haveRegularAndWideSameValue(responsiveValue: ResponsiveValue<boolean | number | string>): boolean {
  if ('regular' in responsiveValue && 'wide' in responsiveValue) {
    return responsiveValue.regular === responsiveValue.wide
  }
  return false
}
