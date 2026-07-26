import type {CSSProperties, ElementType} from 'react'

/** Allows a presentational component to select its rendered element. */
export interface AsProp {
  as?: ElementType
}

/** CSS properties that include custom properties used to bridge component state and styles. */
export type CSSPropertiesWithCustomProperties = CSSProperties & Record<`--${string}`, string | number | undefined>
