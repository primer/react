/**
 * Extract a component's props
 *
 * Source: https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase#wrappingmirroring-a-component
 *
 * @example ComponentProps<typeof MyComponent>
 */
export type ComponentProps<
  T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
> = React.ComponentProps<T> &
  (T extends React.ComponentType<infer Props> ? (Props extends object ? Props : never) : never)
