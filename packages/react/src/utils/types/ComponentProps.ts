import type {ComponentType, PropsWithChildren} from 'react'

/**
 * Extract a component's props
 *
 * Source: https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase#wrappingmirroring-a-component
 *
 * @example ComponentProps<typeof MyComponent>
 */
export type ComponentProps<T> = T extends ComponentType<PropsWithChildren<infer Props>>
  ? Props extends object
    ? Props
    : never
  : never
