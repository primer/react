import type {ComponentPropsWithRef, CSSProperties, ElementType, Ref} from 'react'

/** Allows a presentational component to select its rendered element. */
export interface AsProp {
  /** Element to render. */
  as?: ElementType
}

/** Element-specific props and refs, requiring an explicit `as` for a non-default root. */
export type PolymorphicProps<As extends ElementType, Props, DefaultAs extends ElementType> = Props & {
  /** Element or component to render. */
  as?: As
  className?: string
} & Omit<ComponentPropsWithRef<As>, keyof Props | 'as' | 'className'> &
  (DefaultAs extends As ? unknown : {as: As})

/** Keeps the legacy default props and ref while inferring props and refs for an explicitly selected element. */
export type PolymorphicPropsWithDefaultRef<As extends ElementType, Props, DefaultAs extends ElementType, DefaultRef> = [
  As,
] extends [never]
  ? Omit<PolymorphicProps<DefaultAs, Props, DefaultAs>, 'as' | 'ref'> & {as?: ElementType; ref?: Ref<DefaultRef>}
  : As extends DefaultAs
    ? Omit<PolymorphicProps<As, Props, DefaultAs>, 'ref'> & {ref?: Ref<DefaultRef>}
    : PolymorphicProps<As, Props, DefaultAs>

/** Allows a legacy broadly typed `as` wrapper without weakening inference for a concrete element. */
export type BroadAsProps<As extends ElementType, Props> = Omit<Props, 'as'> & {
  /** Element or component supplied by the wrapper. */
  as?: As
} & (ElementType extends As ? unknown : never)

/** CSS properties that include custom properties used to bridge component state and styles. */
export type CSSPropertiesWithCustomProperties = CSSProperties & Record<`--${string}`, string | number | undefined>
