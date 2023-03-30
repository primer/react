/**
 * Construct a type describing the items in `T`, if `T` is an array.
 */
export type Flatten<T> = T extends (infer U)[] ? U : never
