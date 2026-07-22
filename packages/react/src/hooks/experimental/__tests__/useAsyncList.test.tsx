import {renderHook, act, waitFor} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {useAsyncList} from '../useAsyncList'

describe('useAsyncList', () => {
  it('loads items on mount', async () => {
    const {result} = renderHook(() => useAsyncList<string>({load: async () => ({items: ['a', 'b']})}))
    await waitFor(() => expect(result.current.items).toEqual(['a', 'b']))
    expect(result.current.loadingState).toBe('idle')
    expect(result.current.hasMore).toBe(false)
  })

  it('re-loads (replacing items) when filterText changes', async () => {
    const load = vi.fn(async ({filterText}: {filterText: string}) => ({items: [filterText || 'all']}))
    const {result, rerender} = renderHook(({filterText}) => useAsyncList<string>({load, filterText}), {
      initialProps: {filterText: ''},
    })
    await waitFor(() => expect(result.current.items).toEqual(['all']))

    rerender({filterText: 'main'})
    await waitFor(() => expect(result.current.items).toEqual(['main']))
  })

  it('paginates with a cursor via loadMore', async () => {
    const load = vi.fn(async ({cursor}: {cursor?: string}) => {
      if (cursor === undefined) return {items: ['a', 'b'], cursor: 'page2'}
      return {items: ['c', 'd']}
    })
    const {result} = renderHook(() => useAsyncList<string>({load}))
    await waitFor(() => expect(result.current.items).toEqual(['a', 'b']))
    expect(result.current.hasMore).toBe(true)

    act(() => result.current.loadMore())
    await waitFor(() => expect(result.current.items).toEqual(['a', 'b', 'c', 'd']))
    expect(result.current.hasMore).toBe(false)
  })

  it('surfaces errors', async () => {
    const {result} = renderHook(() =>
      useAsyncList<string>({
        load: async () => {
          throw new Error('boom')
        },
      }),
    )
    await waitFor(() => expect(result.current.loadingState).toBe('error'))
    expect((result.current.error as Error).message).toBe('boom')
  })
})
