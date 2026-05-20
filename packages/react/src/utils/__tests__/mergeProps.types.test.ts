import {mergeProps} from '../mergeProps'

export function mergePropsKeepsPropsFromBothObjects() {
  const merged = mergeProps({foo: 'foo'}, {bar: 1})

  return merged satisfies {foo: string; bar: number}
}

export function mergePropsUsesSecondObjectForOverlappingProps() {
  const merged = mergeProps({value: 'one'}, {value: 1})

  return merged satisfies {value: number}
}

export function mergePropsDoesNotIntersectOverlappingProps() {
  const merged = mergeProps({value: 'one'}, {value: 1})

  // @ts-expect-error overlapping props should use the second object type instead of an impossible intersection
  const value: never = merged.value

  return value
}
