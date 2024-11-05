/**
 * Extract a component's props
 *
 * Source: https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase#wrappingmirroring-a-component
 *
 * @example ComponentProps<typeof MyComponent>
 */
export type ComponentProps<T> =
  T extends React.ComponentType<React.PropsWithChildren<infer Props>> ? (Props extends object ? Props : never) : never
