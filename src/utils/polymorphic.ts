import React from 'react'

/* -------------------------------------------------------------------------------------------------
 * Utility types
 * -----------------------------------------------------------------------------------------------*/
export type Merge<P1 = Record<string, unknown>, P2 = Record<string, unknown>> = Omit<P1, keyof P2> & P2

export type MergeProps<E, P = Record<string, unknown>> = P &
  Merge<E extends React.ElementType ? React.ComponentPropsWithRef<E> : never, P>

/**
 * Infers the OwnProps if E is a ForwardRefExoticComponentWithAs
 */
export type OwnProps<E> = E extends ForwardRefComponent<any, infer P> ? P : Record<string, unknown>

/**
 * Infers the JSX.IntrinsicElement if E is a ForwardRefExoticComponentWithAs
 */
export type IntrinsicElement<E> = E extends ForwardRefComponent<infer I, any> ? I : never

export type NarrowIntrinsic<E> = E extends keyof JSX.IntrinsicElements ? E : never

/* -------------------------------------------------------------------------------------------------
 * ForwardRefComponent
 * -----------------------------------------------------------------------------------------------*/

export interface ForwardRefComponent<
  IntrinsicElementString,
  OwnProps = Record<string, unknown>
  /**
   * Extends original type to ensure built in React types play nice
   * with polymorphic components still e.g. `React.ElementRef` etc.
   */
>
  extends React.ForwardRefExoticComponent<
    MergeProps<IntrinsicElementString, OwnProps & {as?: IntrinsicElementString}>
  > {
  /**
   * When passing an `as` prop as a string, use this overload.
   * Merges original own props (without DOM props) and the inferred props
   * from `as` element with the own props taking precendence.
   *
   * We explicitly define a `JSX.IntrinsicElements` overload so that
   * events are typed for consumers.
   */
  <As extends keyof JSX.IntrinsicElements = NarrowIntrinsic<IntrinsicElementString>>(
    props: MergeProps<As, OwnProps & {as: As}>
  ): React.ReactElement | null

  /**
   * When passing an `as` prop as a component, use this overload.
   * Merges original own props (without DOM props) and the inferred props
   * from `as` element with the own props taking precendence.
   *
   * We don't use `React.ComponentType` here as we get type errors
   * when consumers try to do inline `as` components.
   */
  <As extends React.ElementType>(props: MergeProps<As, OwnProps & {as: As}>): React.ReactElement | null
}
