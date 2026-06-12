import React, {createContext, useCallback, useContext, useMemo, useRef, useSyncExternalStore} from 'react'
import type {Column} from './column'
import type {UniqueRow} from './row'

// ---------------------------------------------------------------------------
// DataTableSnapshotContext
//
// Lets sibling components (`Table.CopyAsMarkdownButton`, future export
// helpers, etc.) consume the rows currently displayed by a sibling
// `<DataTable>` — *after* the table's internal sort / filter / pagination
// have been applied. Without this, a button rendered inside `Table.Actions`
// could only see the raw `data` prop and would copy the original, unsorted
// order even though the user is looking at sorted rows.
//
// Architecture:
//   - `Table.Container` mounts a small subscribe/publish store and provides
//     it via context.
//   - `<DataTable>` publishes its visible rows whenever they change.
//   - Consumers read the latest snapshot via `useSyncExternalStore` so they
//     re-render in sync with the publisher.
//
// Standalone usage (no `Table.Container` ancestor) is still supported —
// consumers pass `rows` and `columns` props directly.
// ---------------------------------------------------------------------------

export type DataTableSnapshot<Data extends UniqueRow = UniqueRow> = {
  rows: ReadonlyArray<Data>
  columns: ReadonlyArray<Column<Data>>
}

type Listener = () => void

export type DataTableSnapshotStore = {
  subscribe: (listener: Listener) => () => void
  getSnapshot: () => DataTableSnapshot | null
  setSnapshot: (next: DataTableSnapshot | null) => void
}

const DataTableSnapshotContext = createContext<DataTableSnapshotStore | null>(null)

/**
 * Create a snapshot store. Returns a stable reference suitable for passing
 * straight to `<DataTableSnapshotContext.Provider>`.
 */
export function useDataTableSnapshotStore(): DataTableSnapshotStore {
  const snapshotRef = useRef<DataTableSnapshot | null>(null)
  const listenersRef = useRef<Set<Listener>>(new Set())

  const subscribe = useCallback<DataTableSnapshotStore['subscribe']>(listener => {
    listenersRef.current.add(listener)
    return () => {
      listenersRef.current.delete(listener)
    }
  }, [])

  const getSnapshot = useCallback<DataTableSnapshotStore['getSnapshot']>(() => snapshotRef.current, [])

  const setSnapshot = useCallback<DataTableSnapshotStore['setSnapshot']>(next => {
    snapshotRef.current = next
    for (const listener of listenersRef.current) {
      listener()
    }
  }, [])

  return useMemo(() => ({subscribe, getSnapshot, setSnapshot}), [subscribe, getSnapshot, setSnapshot])
}

/**
 * Provider element. Re-exports the underlying context's Provider so the
 * inferred children prop type is correct.
 */
export const DataTableSnapshotProvider = DataTableSnapshotContext.Provider

/**
 * Read the snapshot store from context. Returns `null` when no ancestor
 * `Table.Container` is providing one.
 */
export function useDataTableSnapshotStoreFromContext(): DataTableSnapshotStore | null {
  return useContext(DataTableSnapshotContext)
}

/**
 * Subscribe to the snapshot store and re-render on changes. Safe to call
 * even when no store is present — returns `null` in that case.
 */
export function useDataTableSnapshot<Data extends UniqueRow = UniqueRow>(): DataTableSnapshot<Data> | null {
  const store = useDataTableSnapshotStoreFromContext()
  return useSyncExternalStore(
    store?.subscribe ?? noopSubscribe,
    () => (store?.getSnapshot() ?? null) as DataTableSnapshot<Data> | null,
    () => null,
  )
}

const noopSubscribe = () => () => {}

/**
 * Helper for `<DataTable>` to publish its visible rows whenever they
 * change. The publish runs in an effect to avoid setState-during-render.
 */
export function usePublishDataTableSnapshot<Data extends UniqueRow>(
  rows: ReadonlyArray<Data>,
  columns: ReadonlyArray<Column<Data>>,
): void {
  const store = useDataTableSnapshotStoreFromContext()
  React.useEffect(() => {
    if (!store) return
    store.setSnapshot({rows, columns} as unknown as DataTableSnapshot)
    return () => {
      // Clear on unmount so a stale snapshot from a removed table doesn't
      // leak to siblings that mount later inside the same Container.
      store.setSnapshot(null)
    }
  }, [store, rows, columns])
}
