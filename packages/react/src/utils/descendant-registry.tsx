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
  useSyncExternalStore,
  type Dispatch,
  type ReactNode,
  type RefObject,
} from 'react'
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect'

export interface ProviderProps<T> {
  children: ReactNode
  /** State setter from `useRegistryState`. */
  setRegistry: Dispatch<React.SetStateAction<ReadonlyMap<string, T> | undefined>>
  /** Clipping container used as the `IntersectionObserver` root for overflow detection. */
  rootRef?: RefObject<Element | null>
}

interface DescendantRegistryContext<T> {
  register: (id: string) => () => void
  updateValue: (id: string, value: T) => void
  key: number
}

/** Subscribe a single observed element to the shared IntersectionObserver. Returns an unsubscribe function. */
type ObserveFn = (element: Element, onOverflowChange: (isOverflowing: boolean) => void) => () => void

interface OverflowObserverContext {
  /** Subscribe an element. `null` when no shared observer is configured for this registry. */
  observe: ObserveFn | null
}

const noopObserve: OverflowObserverContext = {observe: null}

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
 * For overflow-style components (e.g. UnderlineNav, ActionBar), use the optional `overflow` option to opt every
 * descendant into a *single* shared `IntersectionObserver` (instead of one observer per item) via
 * `useRegisterOverflowObserver`. This reduces observer allocations and batches resize-driven callbacks.
 *
 * @note Note that this pattern is not SSR compatible. It won't raise errors or hydration mismatches, but the
 * registry will not be available during SSR. The registry is built during the effect phase, so it will be populated
 * after hydration on the client. The initial `undefined` value can be used to safely show loading UI during SSR/initial
 * render if necessary.
 */
export function createDescendantRegistry<T>(options?: {
  /**
   * Configure a shared IntersectionObserver owned by the `Provider`. When set, descendants can call
   * `useRegisterOverflowObserver` to subscribe to a single observer rather than each creating their own.
   */
  overflow?: object
}) {
  const Context = createContext<DescendantRegistryContext<T>>({
    register: () => () => {},
    updateValue: () => {},
    key: -1,
  })

  const ObserverContext = createContext<OverflowObserverContext>(noopObserve)

  const overflowEnabled = options?.overflow !== undefined

  /**
   * Instantiate descendant registry state. The initial value will be `undefined`, indicating that the registry hasn't
   * been built yet.
   */
  function useRegistryState() {
    // We could do this inside of `Provider`, but then it would be difficult for the parent itself to access the state value
    return useState<ReadonlyMap<string, T>>()
  }

  /** Register a descendant component with the registry. */
  function useRegisterDescendant(value: T) {
    const {register, updateValue, key} = useContext(Context)

    const id = useId()

    useEffect(() => register(id), [register, id, key])

    useEffect(() => updateValue(id, value), [updateValue, id, value, key])

    return id
  }

  /**
   * Subscribe an element to the registry's shared IntersectionObserver and derive whether it is currently overflowing
   * from the observed entry. Falls back to a per-item observer when no shared observer is configured for this registry,
   * so the hook is always safe to call.
   *
   * If the root-scoped `intersectionRatio` signal proves unreliable at the wrap boundary, fall back to caching
   * `ref.current.offsetTop > 0` inside the observer callback (NOT in getSnapshot) and returning the cached value.
   * This mirrors the historical reason `ActionBar` used a looser threshold for the offsetTop approach.
   *
   * @param ref Ref to the element whose overflow state should be tracked.
   * @param options.disabled When true, skips observer subscription entirely and always reports `false`. Useful for
   *   items whose overflow is determined by an ancestor (e.g. ActionBar items inside an overflowing group).
   */
  function useRegisterOverflowObserver(ref: RefObject<HTMLElement | null>, options?: {disabled?: boolean}) {
    const disabled = options?.disabled ?? false
    const {observe} = useContext(ObserverContext)
    const isOverflowingRef = useRef(false)

    const subscribe = useCallback(
      (onChange: () => void) => {
        if (disabled) return () => {}
        const element = ref.current
        if (!element) return () => {}

        const updateOverflowState = (isOverflowing: boolean) => {
          if (isOverflowing !== isOverflowingRef.current) {
            isOverflowingRef.current = isOverflowing
            onChange()
          }
        }

        // Prefer the provider's shared observer; fall back to a local observer when none is configured.
        if (observe) return observe(element, updateOverflowState)

        if (typeof IntersectionObserver === 'undefined') return () => {}

        const observer = new IntersectionObserver(
          entries => {
            for (const entry of entries) {
              if (entry.target === element) updateOverflowState(getIsOverflowing(entry))
            }
          },
          {threshold: [0, 1]},
        )
        observer.observe(element)
        return () => observer.disconnect()
      },
      [ref, observe, disabled],
    )

    return useSyncExternalStore(
      subscribe,
      () => (disabled ? false : isOverflowingRef.current),
      () => false,
    )
  }

  const unsetValue = Symbol('unset')

  /** Provide context for registering descendant components. This only needs to wrap `children`. */
  function Provider({children, setRegistry, rootRef}: ProviderProps<T>) {
    const workingRegistryRef = useRef<Map<string, T | typeof unsetValue> | 'queued' | 'idle'>('queued')

    /** State value to trigger a re-render and force all descendants to re-register. This ensures everything remains ordered. */
    const [key, rebuildRegistry] = useReducer(prev => prev + 1, 0)

    // Coalesce rebuilds: when several descendants register in the same tick (e.g. multiple items crossing the wrap
    // boundary during one resize frame), schedule a single rebuild via microtask instead of one rebuild per
    // registration. The microtask drains before paint, so the rebuild still lands within the same frame.
    const pendingRebuildRef = useRef(false)
    const isMountedRef = useRef(true)
    const scheduleRebuild = useCallback(() => {
      if (pendingRebuildRef.current) return
      pendingRebuildRef.current = true
      queueMicrotask(() => {
        pendingRebuildRef.current = false
        // Guard against dispatching into an unmounted provider.
        if (isMountedRef.current) rebuildRegistry()
      })
    }, [])

    useEffect(() => {
      isMountedRef.current = true
      return () => {
        isMountedRef.current = false
      }
    }, [])

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
          // be inserted anywhere in the tree, changing the order of items). Coalesce concurrent registrations so the
          // rebuild only happens once per tick.
          workingRegistryRef.current = 'queued'
          scheduleRebuild()
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
      [setRegistry, scheduleRebuild],
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
        // eslint-disable-next-line react-you-might-not-need-an-effect/no-pass-data-to-parent
        setRegistry(new Map(setEntries))
        workingRegistryRef.current = 'idle'
      }
    })

    const contextValue = useMemo(() => ({register, updateValue, key}), [register, updateValue, key])

    return (
      <Context.Provider value={contextValue}>
        {overflowEnabled ? <OverflowObserverProvider rootRef={rootRef}>{children}</OverflowObserverProvider> : children}
      </Context.Provider>
    )
  }

  /**
   * Owns a single IntersectionObserver shared by every descendant that calls `useRegisterOverflowObserver`.
   * Each observed element maps to a set of change callbacks; one observer notification fans out to all of them.
   */
  function OverflowObserverProvider({children, rootRef}: {children: ReactNode; rootRef?: RefObject<Element | null>}) {
    // Map of observed element -> set of subscriber callbacks.
    const subscribersRef = useRef<Map<Element, Set<(isOverflowing: boolean) => void>>>(new Map())
    const observedElementsRef = useRef<Set<Element>>(new Set())
    const observerRef = useRef<IntersectionObserver | null>(null)
    const observerRootRef = useRef<Element | null>(null)

    // Lazily create the observer on first subscribe so SSR / zero-item renders allocate nothing.
    const getObserver = useCallback(() => {
      if (typeof IntersectionObserver === 'undefined') return null
      if (rootRef && rootRef.current === null) return null

      const root = rootRef?.current ?? null
      if (observerRef.current && observerRootRef.current === root) return observerRef.current

      observerRef.current?.disconnect()
      observedElementsRef.current.clear()

      observerRef.current = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            const callbacks = subscribersRef.current.get(entry.target)
            if (!callbacks) continue
            const isOverflowing = getIsOverflowing(entry)
            for (const cb of callbacks) cb(isOverflowing)
          }
        },
        {root, threshold: [0, 1]},
      )
      observerRootRef.current = root
      return observerRef.current
    }, [rootRef])

    const observeSubscribedElements = useCallback(() => {
      const observer = getObserver()
      if (!observer) return

      for (const element of subscribersRef.current.keys()) {
        if (!observedElementsRef.current.has(element)) {
          observer.observe(element)
          observedElementsRef.current.add(element)
        }
      }
    }, [getObserver])

    const observe = useCallback<ObserveFn>(
      (element, onOverflowChange) => {
        let callbacks = subscribersRef.current.get(element)
        if (!callbacks) {
          callbacks = new Set()
          subscribersRef.current.set(element, callbacks)
        }
        callbacks.add(onOverflowChange)
        observeSubscribedElements()

        return () => {
          const set = subscribersRef.current.get(element)
          if (!set) return
          set.delete(onOverflowChange)
          if (set.size === 0) {
            subscribersRef.current.delete(element)
            observedElementsRef.current.delete(element)
            observerRef.current?.unobserve(element)
          }
        }
      },
      [observeSubscribedElements],
    )

    useIsomorphicLayoutEffect(() => {
      observeSubscribedElements()
    })

    useEffect(() => {
      const subscribers = subscribersRef.current
      const observedElements = observedElementsRef.current
      return () => {
        observerRef.current?.disconnect()
        observerRef.current = null
        observedElements.clear()
        subscribers.clear()
      }
    }, [])

    const value = useMemo<OverflowObserverContext>(() => ({observe}), [observe])

    return <ObserverContext.Provider value={value}>{children}</ObserverContext.Provider>
  }

  return {Provider, useRegistryState, useRegisterDescendant, useRegisterOverflowObserver}
}

/**
 * Treat any target that is not fully visible within the observer root as overflowing. Wrapped items should be fully
 * clipped (`isIntersecting: false`, `intersectionRatio: 0`), but partial ratios also count as overflowing to guard
 * against sub-pixel boundary cases.
 */
function getIsOverflowing(entry: Pick<IntersectionObserverEntry, 'intersectionRatio' | 'isIntersecting'>) {
  return !entry.isIntersecting || entry.intersectionRatio < 1
}
