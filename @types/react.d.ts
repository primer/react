import 'react'

/**
 * Types in this file are copied from DefinitelyTyped's react 18 branch
 * These are future facing, and this file is designed to be deleted _entirely_
 * when react 18 upgrading is complete
 *
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts
 *
 * eslint disables are specifically to support those types.
 */
declare module 'react' {
  /**
   * Temporary override removing children from FunctionComponent, to comply with
   * typings for react 18.  this is a forward thinking change
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  export interface FunctionComponent<P = {}> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (props: P, context?: any): ReactElement<any, any> | null
    propTypes?: WeakValidationMap<P> | undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contextTypes?: ValidationMap<any> | undefined
    defaultProps?: Partial<P> | undefined
    displayName?: string | undefined
  }

  /**
   * This type update enforces that function parameters are well typed
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  export function useCallback<T extends Function>(callback: T, deps: DependencyList): T
}
