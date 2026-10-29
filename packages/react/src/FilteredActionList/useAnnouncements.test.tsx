import {act, renderHook} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi, type MockInstance} from 'vitest'
import {useAnnouncements} from './useAnnouncements'

describe('useAnnouncements', () => {
  let ariaNotify: MockInstance<Document['ariaNotify']>

  beforeEach(() => {
    vi.useFakeTimers()
    ariaNotify = vi.spyOn(document, 'ariaNotify').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('includes the input label in the initial focus announcement', async () => {
    const input = document.createElement('input')
    input.setAttribute('aria-label', 'Filter fields')

    const list = document.createElement('ul')
    list.setAttribute('role', 'listbox')
    const activeOption = document.createElement('li')
    activeOption.setAttribute('role', 'option')
    activeOption.setAttribute('data-is-active-descendant', 'true')
    activeOption.textContent = 'Start date'
    list.append(activeOption)
    const listRef: {current: HTMLUListElement | null} = {current: null}

    const {result} = renderHook(() => {
      return useAnnouncements(
        [{text: 'Start date'}],
        listRef,
        {current: input},
        true,
        false,
        undefined,
        'active-descendant',
      )
    })

    act(() => {
      result.current()
      listRef.current = list
    })

    await act(async () => {
      await vi.runAllTimersAsync()
    })
    expect(ariaNotify).toHaveBeenCalledExactlyOnceWith(
      'Filter fields, filter text box and list of items, Focused item: Start date, not selected, 1 of 1',
      {
        priority: 'normal',
      },
    )
  })

  it('uses aria-labelledby before aria-label in the initial focus announcement', async () => {
    const label = document.createElement('span')
    label.id = 'filter-label'
    label.textContent = 'Issue fields'
    document.body.append(label)

    const input = document.createElement('input')
    input.setAttribute('aria-label', 'Filter fields')
    input.setAttribute('aria-labelledby', label.id)

    const list = document.createElement('ul')
    list.setAttribute('role', 'listbox')
    const activeOption = document.createElement('li')
    activeOption.setAttribute('role', 'option')
    activeOption.setAttribute('data-is-active-descendant', 'true')
    activeOption.textContent = 'Start date'
    list.append(activeOption)

    const {result} = renderHook(() => {
      return useAnnouncements(
        [{text: 'Start date'}],
        {current: list},
        {current: input},
        true,
        false,
        undefined,
        'active-descendant',
      )
    })

    act(() => {
      result.current()
    })

    await act(async () => {
      await vi.runAllTimersAsync()
    })
    expect(ariaNotify).toHaveBeenCalledExactlyOnceWith(
      'Issue fields, filter text box and list of items, Focused item: Start date, not selected, 1 of 1',
      {
        priority: 'normal',
      },
    )

    label.remove()
  })

  it('uses an associated native label in the initial focus announcement', async () => {
    const label = document.createElement('label')
    label.htmlFor = 'filter-input'
    label.textContent = 'Filter fields'

    const input = document.createElement('input')
    input.id = 'filter-input'
    document.body.append(label, input)

    const list = document.createElement('ul')
    list.setAttribute('role', 'listbox')
    const activeOption = document.createElement('li')
    activeOption.setAttribute('role', 'option')
    activeOption.setAttribute('data-is-active-descendant', 'true')
    activeOption.textContent = 'Start date'
    list.append(activeOption)

    const {result} = renderHook(() => {
      return useAnnouncements(
        [{text: 'Start date'}],
        {current: list},
        {current: input},
        true,
        false,
        undefined,
        'active-descendant',
      )
    })

    act(() => {
      result.current()
    })

    await act(async () => {
      await vi.runAllTimersAsync()
    })
    expect(ariaNotify).toHaveBeenCalledExactlyOnceWith(
      'Filter fields, filter text box and list of items, Focused item: Start date, not selected, 1 of 1',
      {
        priority: 'normal',
      },
    )

    label.remove()
    input.remove()
  })

  it('does not announce when items are recreated with the same announcement state', async () => {
    const list = document.createElement('ul')
    const activeOption = document.createElement('li')
    activeOption.setAttribute('role', 'option')
    activeOption.setAttribute('data-is-active-descendant', 'true')
    list.append(activeOption)

    const {rerender} = renderHook(
      ({items}) => {
        return useAnnouncements(items, {current: list}, {current: null}, true, false, undefined, 'active-descendant')
      },
      {
        initialProps: {
          items: [
            {
              id: 'start-date',
              text: 'Start date',
              selected: false,
            },
          ],
        },
      },
    )

    rerender({items: [{id: 'start-date', text: 'Start date', selected: false}]})

    await act(async () => {
      await vi.runAllTimersAsync()
    })
    expect(ariaNotify).not.toHaveBeenCalled()
  })

  it.each(['active-descendant', 'roving-tabindex'] as const)(
    'cancels a pending %s announcement when loading starts',
    async focusManagement => {
      const items = [
        {
          text: 'Start date',
        },
      ]
      const list = document.createElement('ul')
      const activeOption = document.createElement('li')
      activeOption.setAttribute('role', 'option')
      activeOption.setAttribute('data-is-active-descendant', 'true')
      activeOption.textContent = 'Start date'
      list.append(activeOption)

      const {result, rerender} = renderHook(
        ({loading}) => {
          return useAnnouncements(items, {current: list}, {current: null}, true, loading, undefined, focusManagement)
        },
        {
          initialProps: {
            loading: false,
          },
        },
      )

      act(() => {
        result.current()
      })
      await act(async () => {
        await vi.advanceTimersByTimeAsync(250)
      })
      expect(ariaNotify).not.toHaveBeenCalled()

      rerender({
        loading: true,
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(ariaNotify).not.toHaveBeenCalled()
    },
  )

  it('announces an unchanged empty state when the filter value changes', async () => {
    const message = {title: 'Nothing found', description: "There's nothing here."}
    const {rerender} = renderHook(
      ({filterValue}) => {
        return useAnnouncements(
          [],
          {current: null},
          {current: null},
          true,
          false,
          message,
          'active-descendant',
          filterValue,
        )
      },
      {
        initialProps: {
          filterValue: '',
        },
      },
    )

    rerender({filterValue: 'zero'})

    await act(async () => {
      await vi.runAllTimersAsync()
    })
    expect(ariaNotify).toHaveBeenCalledExactlyOnceWith("Nothing found. There's nothing here.", {
      priority: 'normal',
    })
  })
})
