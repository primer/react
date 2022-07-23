import {ResponsiveValue, useResponsiveValue} from '../../hooks/useResponsiveValue'

export function shouldAcceptNonResponsiveValues() {
  const value: string = useResponsiveValue('test', 'fallback')
}

export function shouldFlattenResponsiveValueTypes() {
  const responsiveValue: ResponsiveValue<
    // regular options
    'a' | 'b',
    // narrow options
    'a' | 'b' | 'c'
  > = {
    regular: 'a',
    narrow: 'c'
  }

  const value: 'a' | 'b' | 'c' = useResponsiveValue(responsiveValue, 'b')
}
