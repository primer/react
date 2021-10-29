// Produces a union of dot-delimited keypaths to the string values in a nested object:
export type KeyPaths<O extends Record<string, unknown>> = {
  [K in keyof O]: K extends string ? (O[K] extends string ? `${K}` : `${K}.${KeyPaths<O[K]>}`) : never
}[keyof O]
