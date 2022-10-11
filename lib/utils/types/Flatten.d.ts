/**
 * Construct a type describing the items in `T`, if `T` is an array.
 */
export declare type Flatten<T extends unknown> = T extends (infer U)[] ? U : never;
