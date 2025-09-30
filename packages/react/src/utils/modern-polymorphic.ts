// Mostly taken from https://github.com/total-typescript/react-typescript-tutorial/blob/main/src/08-advanced-patterns/72-as-prop-with-forward-ref.solution.tsx

import {forwardRef} from 'react'
import type {ComponentPropsWithRef, ElementType} from 'react'

/**
 * Distributive Omit utility type that works correctly with union types
 */
type DistributiveOmit<T, TOmitted extends PropertyKey> = T extends unknown ? Omit<T, TOmitted> : never

/**
 * Fixed version of forwardRef that provides better type inference for polymorphic components
 */
// TODO: figure out how to change this type so we can set displayName
// like this: `ComponentName.displayName = 'DisplayName' instead of using workarounds
type FixedForwardRef = <T, P = object>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode,
) => (props: P & React.RefAttributes<T>) => React.ReactNode

/**
 * Cast forwardRef to the fixed version with better type inference
 */
export const fixedForwardRef = forwardRef as FixedForwardRef

/**
 * Simplified polymorphic props type that handles the common pattern of
 * `DistributiveOmit<ComponentPropsWithRef<ElementType extends As ? DefaultElement : As>, 'as'>`
 */
export type PolymorphicProps<
  TAs extends ElementType,
  TDefaultElement extends ElementType = 'div',
  Props = object,
> = DistributiveOmit<ComponentPropsWithRef<ElementType extends TAs ? TDefaultElement : TAs> & Props, 'as'> & {
  as?: TAs
}
