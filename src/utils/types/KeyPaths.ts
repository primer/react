// Produces a union of dot-delimited keypaths to the string values in a nested object:
export type KeyPaths<O extends Record<string, unknown>> = {
  [K in keyof O]: K extends string
    ? O[K] extends string
      ? `${K}`
      : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore TypeScript has bested me, but the KeyPaths type is tested.
        `${K}.${KeyPaths<O[K]>}`
    : never
}[keyof O]
