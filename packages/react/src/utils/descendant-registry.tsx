import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
} from 'react'
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect'

interface ProviderProps<T> {
  children: ReactNode
  /** State setter from `useRegistryState`. */
  setRegistry: Dispatch<React.SetStateAction<ReadonlyMap<string, T> | undefined>>
}

/**
 * Create a "descendant registry" for a component. This allows a parent to store and track an ordered registry of
 * child components, even if they are deeply nested in the tree. For example, a menu component can use this to track
 * every menu item inside of it, including menu items inside of fragments and subcomponents. The order of the resulting
 * `Map` will match the render order in the React tree.
 *
 * Usage:
 * 1. Create a registry at the file level in a similar manner to creating a new React context. Set `T` to the data type
 *    of the registry - this can be anything **except** a function.
 * 2. In the parent component, instantiate the registry state via `useRegistryState`. Then wrap `children` in the
 *    registry context `Provider` with `setRegistry` set to the state setter function.
 * 3. Register child components via `useRegisterDescendant` or `useRegisterDescendantCallback`.
 * 4. Access the registered data using the value from `useRegistryState`. This will be a map of `string` to `T`, where
 *    the string key is a unique and stable identifier for each component which can be used as a `key` if necessary.
 *
 * @note Note that this pattern is not SSR compatible. The registry is built during the effect phase, so it will not
 * be populated on the first render. The initial `undefined` value can be used to show loading UI during SSR/initial
 * render if necessary.
 */
export function createDescendantRegistry<T>() {
  const Context = createContext<{
    register: (id: string) => () => void
    updateValue: (id: string, value: T) => void
    key: number
  }>({
    register: () => () => {},
    updateValue: () => {},
    key: -1,
  })

  /**
   * Instantiate descendant registry state. The initial value will be `undefined`, indicating that the registry hasn't
   * been built yet.
   */
  function useRegistryState() {
    // We could do this inside of `Provider`, but then it would be difficult for the parent itself to access the state value
    return useState<ReadonlyMap<string, T>>()
  }

  /**
   * Register a descendant component with the registry, using a callback to get the data. Use this instead of
   * `useRegisterDescendant` when you need to access a ref value or do some calculation to get the data that you want
   * to register. The callback will be called during the effect phase. Ensure the callback is stable (`useCallback`).
   */
  function useRegisterDescendantCallback(valueCallback: () => T) {
    const {register, updateValue, key} = useContext(Context)

    const id = useId()

    useEffect(() => register(id), [register, id, key])

    useEffect(() => updateValue(id, valueCallback()), [updateValue, id, valueCallback, key])

    return id
  }

  /** Simplified version of `useRegisterDescendantCallback` that allows directly passing a memoized value. */
  function useRegisterDescendant(value: T) {
    const valueCallback = useCallback(() => value, [value])

    return useRegisterDescendantCallback(valueCallback)
  }

  const unsetValue = Symbol('unset')

  /** Provide context for registering descendant components. This only needs to wrap `children`. */
  function Provider({children, setRegistry}: ProviderProps<T>) {
    const workingRegistryRef = useRef<Map<string, T | typeof unsetValue> | 'queued' | 'idle'>('queued')

    /** State value to trigger a re-render and force all descendants to re-register. This ensures everything remains ordered. */
    const [key, rebuildRegistry] = useReducer(prev => prev + 1, 0)

    // If a rebuild is queued, instantiate a new map. Must be in a layout effect to run before all descendants' effects run to populate it
    useIsomorphicLayoutEffect(function instantiateNewRegistry() {
      if (workingRegistryRef.current === 'queued') {
        workingRegistryRef.current = new Map<string, T>()
      }
    })

    /**
     * Register a mounted descendant in the registry.
     * @returns A cleanup function to unregister the descendant.
     */
    const register = useCallback(
      (id: string) => {
        if (workingRegistryRef.current instanceof Map) {
          // Initializing to `unsetValue` allows the `register` effect to not depend on the value
          workingRegistryRef.current.set(id, unsetValue)
        } else if (workingRegistryRef.current === 'idle') {
          // When idle, registering a new component causes the whole registry to be rebuilt (because that item could
          // be inserted anywhere in the tree, changing the order of items)
          workingRegistryRef.current = 'queued'
          rebuildRegistry()
        }
        // Noop if status is `queued` since we will restart the map in the next cycle

        return function unregister() {
          if (workingRegistryRef.current instanceof Map) {
            workingRegistryRef.current.delete(id)
          } else if (workingRegistryRef.current === 'idle') {
            // No need to rebuild the registry when unregistering, because removing an item doesn't affect the order
            // the rest of the items
            setRegistry(prev => {
              const copy = new Map(prev)
              copy.delete(id)
              return copy
            })
          }
        }
      },
      [setRegistry],
    )

    /** Update a descendant's value in the registry. */
    const updateValue = useCallback(
      (id: string, value: T) => {
        if (workingRegistryRef.current instanceof Map) {
          workingRegistryRef.current.set(id, value)
        } else if (workingRegistryRef.current === 'idle') {
          // No need to rebuild the registry when updating a value; that doesn't affect order
          setRegistry(prev => new Map(prev).set(id, value))
        }
        // Ignore `queued` stage; a rebuild is coming that will capture the new value in the next render
      },
      [setRegistry],
    )

    // After all descendants' effects complete, commit the working registry to state
    useEffect(function commitWorkingRegistry() {
      if (workingRegistryRef.current instanceof Map) {
        // There shouldn't be any unset values left, but still filter them just in case
        const setEntries = Array.from(workingRegistryRef.current.entries()).filter(
          (entry): entry is [string, T] => entry[1] !== unsetValue,
        )
        setRegistry(new Map(setEntries))
        workingRegistryRef.current = 'idle'
      }
    })

    const contextValue = useMemo(() => ({register, updateValue, key}), [register, updateValue, key])

    return <Context.Provider value={contextValue}>{children}</Context.Provider>
  }

  return {Provider, useRegistryState, useRegisterDescendant, useRegisterDescendantCallback}
}
