/**
 * Extract a component's props
 *
 * Source: https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase#wrappingmirroring-a-component
 *
 * @example ComponentProps<typeof MyComponent>
 */
export type ComponentProps<T> = T extends React.ComponentType<infer Props>
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    Props extends object
    ? Props
    : never
  : never

/**
 * Contruct a type describing the items in `T`, if `T` is an array.
 */
export type Flatten<T extends unknown> = T extends (infer U)[] ? U : never