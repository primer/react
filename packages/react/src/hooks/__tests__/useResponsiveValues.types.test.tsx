import type {ResponsiveValue} from '../../hooks/useResponsiveValue'
import {useResponsiveValue} from '../../hooks/useResponsiveValue'

export function ShouldAcceptNonResponsiveValues() {
  const value: string = useResponsiveValue('test', 'fallback')
  return <div>{value}</div>
}

export function ShouldFlattenResponsiveValueTypes() {
  const responsiveValue: ResponsiveValue<
    // regular options
    'a' | 'b',
    // narrow options
    'a' | 'b' | 'c'
  > = {
    regular: 'a',
    narrow: 'c',
  }

  const value: 'a' | 'b' | 'c' = useResponsiveValue(responsiveValue, 'b')
  return <div>{value}</div>
}
