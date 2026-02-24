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
  setRegistry: Dispatch<React.SetStateAction<Map<string, T>>>
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

  /** Instantiate descendant registry state. */
  function useRegistryState() {
    // We could do this inside of `Provider`, but then it would be difficult for the parent itself to access the state value
    return useState(() => new Map<string, T>())
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
    const [key, incrementKey] = useReducer(prev => prev + 1, 0)

    /** Queue a full tree rebuild to recollect all descendants in order. */
    const queueRebuild = useCallback(() => {
      workingRegistryRef.current = 'queued'
      incrementKey()
    }, [])

    // If a rebuild is queued, instantiate a new map before all descendants' effects run to populate it
    useIsomorphicLayoutEffect(function instantiateNewRegistry() {
      if (workingRegistryRef.current === 'queued') {
        workingRegistryRef.current = new Map<string, T>()
      }
    })

    /**
     * Each descendant will register itself. While building, this will just update the map. While idle, any descendant
     * mounts or unmounts will trigger a full recalculation of the registry. This is necessary because a descendant
     * might mount into the middle of the tree, and the only way for the provider to know that is to re-render the
     * tree and listen to every descendant effect in order.
     */
    const register = useCallback(
      (id: string) => {
        if (workingRegistryRef.current instanceof Map) {
          // Initializing to `unsetValue` allows the `register` effect to not depend on the value
          workingRegistryRef.current.set(id, unsetValue)
        } else if (workingRegistryRef.current === 'idle') {
          queueRebuild()
        }

        return () => {
          if (workingRegistryRef.current instanceof Map) {
            workingRegistryRef.current.delete(id)
          } else if (workingRegistryRef.current === 'idle') {
            queueRebuild()
          }
        }
      },
      [queueRebuild],
    )

    /**
     * Update a descendant's value in the registry. Unlike a mount/dismount, a simple value update does not need to
     * trigger a full recalculation, since we know the order did not change.
     */
    const updateValue = useCallback(
      (id: string, value: T) => {
        if (workingRegistryRef.current instanceof Map) {
          workingRegistryRef.current.set(id, value)
        } else if (workingRegistryRef.current === 'idle') {
          setRegistry(prev => new Map(prev).set(id, value))
        }
        // Ignore `queued` stage; a rebuild is coming that will capture the new value in the next render
      },
      [setRegistry],
    )

    // After all descendants' effects complete, commit the working registry to state
    useEffect(function commitWorkingRegistry() {
      if (workingRegistryRef.current instanceof Map) {
        // There shouldn't be any unset values left, but just in case, filter them out
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
