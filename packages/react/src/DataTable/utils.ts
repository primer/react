// Utility type to generate an array with a given length. Each member of the
// array type is the length of the array
type ArrayOfLength<Length extends number, SizedArray extends Array<unknown> = []> = SizedArray['length'] extends Length
  ? SizedArray
  : ArrayOfLength<Length, [...SizedArray, SizedArray['length']]>

// A union of the valid lengths of an Array that we'll support in `ObjectPaths`
// below. This is to prevent unbounded arrays from polluting expected types
type MaxLength = ArrayOfLength<10>[number]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ArrayIndex<A extends ReadonlyArray<any>, Keys extends number = never> = A extends readonly []
  ? Keys
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
  A extends readonly [infer _, ...infer Tail]
  ? ArrayIndex<Tail, Keys | Tail['length']>
  : Keys

// Check if the given type is within the bounds set by `MaxLength`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ArrayWithinBounds<T> = T extends ReadonlyArray<any> & {length: infer Length}
  ? Length extends MaxLength
    ? T
    : never
  : never

// Get all valid "paths" for an object. This is useful for APIs which require
// a string input that must refer to a valid type for the data being used.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ObjectPaths<T> = T extends readonly any[] & ArrayWithinBounds<T>
  ? `${ArrayIndex<T>}` | PrefixPath<T, ArrayIndex<T>>
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends any[]
  ? never & 'Unable to determine keys of potentially boundless array'
  : T extends Date
  ? never
  : T extends object
  ? Extract<keyof T, string | number> | PrefixPath<T, Extract<keyof T, string | number>>
  : never

type PrefixPath<T, Prefix> = Prefix extends Extract<keyof T, number | string>
  ? `${Prefix}.${ObjectPaths<T[Prefix]>}`
  : never

// Get the value of a given path within an object
export type ObjectPathValue<ObjectType extends object, Path extends string | number> = ObjectType extends Record<
  string | number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>
  ? Path extends `${infer Key}.${infer NestedPath}`
    ? ObjectPathValue<ObjectType[Key], NestedPath>
    : ObjectType[Path]
  : never
