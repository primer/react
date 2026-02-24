import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
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
    register: (id: string, value: T) => () => void
    key: number
  }>({
    register: () => () => {},
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
    const {register, key} = useContext(Context)

    const id = useId()

    useEffect(() => register(id, valueCallback()), [register, id, valueCallback, key])

    return id
  }

  /** Simplified version of `useRegisterDescendantCallback` that allows directly passing a memoized value. */
  function useRegisterDescendant(value: T) {
    const valueCallback = useCallback(() => value, [value])

    return useRegisterDescendantCallback(valueCallback)
  }

  /** Provide context for registering descendant components. This only needs to wrap `children`. */
  function Provider({children, setRegistry}: ProviderProps<T>) {
    const workingRegistryRef = useRef<Map<string, T> | 'queued' | 'idle'>('queued')

    /** State value to trigger a re-render and force all descendants to re-register. This ensures everything remains ordered. */
    const [key, setKey] = useState(0)

    /**
     * Tracks the `children` reference from the previous render to detect when the parent
     * re-renders with new children (e.g., due to a reorder), as opposed to a Provider re-render
     * triggered by our own `setRegistry` call (where children stay the same reference).
     */
    const prevChildrenRef = useRef<ReactNode>(children)

    // Instantiate a new map before all descendants' effects run to populate it
    useIsomorphicLayoutEffect(function instantiateNewRegistry() {
      if (workingRegistryRef.current === 'queued') {
        workingRegistryRef.current = new Map<string, T>()
      }
    })

    // Each descendant will register itself. Initially this will just update the map. After the initial render and
    // commit, any descendant updates (mounts, unmounts, or value changes) will trigger a full recalculation of the
    // registry. This is necessary because a descendant might mount into the middle of the tree, and the only way for
    // the provider to know that is to re-render the tree and listen to every descendant effect in order.
    const register = useCallback((id: string, value: T) => {
      function queueRebuild() {
        // If we instantiate a new map now, we'd commit it in the ensuing provider effect, which would trigger a
        // new state update and cause an infinite render loop. So we wait to instantiate it until the next layout effect,
        // which we know will happen because we update state to queue a new render.
        workingRegistryRef.current = 'queued'
        setKey(prev => prev + 1)
      }

      if (workingRegistryRef.current instanceof Map) {
        workingRegistryRef.current.set(id, value)
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
    }, [])

    // After all descendants' effects complete, commit the working registry to state. When the
    // registry is idle and the children reference changed (indicating the parent re-rendered with
    // new children, e.g., due to a reorder), queue a rebuild so all descendants re-register in
    // their current render order, keeping the registry accurate.
    //
    // This effect intentionally omits a dependency array so it runs after every render. Adding
    // deps would prevent the registry Map from being committed after rebuild cycles (where `key`
    // increments but `children` and `setRegistry` stay the same).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(function commitWorkingRegistry() {
      const childrenChanged = prevChildrenRef.current !== children
      prevChildrenRef.current = children

      if (workingRegistryRef.current instanceof Map) {
        setRegistry(workingRegistryRef.current)
        workingRegistryRef.current = 'idle'
      } else if (workingRegistryRef.current === 'idle' && childrenChanged) {
        // The children changed (e.g., reordering) without triggering any descendant
        // mount/unmount/update. Trigger a rebuild to capture the new render order.
        workingRegistryRef.current = 'queued'

        setKey(prev => prev + 1)
      }
    })

    const contextValue = useMemo(() => ({register, key}), [register, key])

    return <Context.Provider value={contextValue}>{children}</Context.Provider>
  }

  return {Provider, useRegistryState, useRegisterDescendant, useRegisterDescendantCallback}
}
