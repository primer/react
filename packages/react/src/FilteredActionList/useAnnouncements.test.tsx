import {act, renderHook} from '@testing-library/react'
import {announce} from '@primer/live-region-element'
import {StrictMode} from 'react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {useAnnouncements} from './useAnnouncements'

vi.mock('@primer/live-region-element', () => ({
  announce: vi.fn(),
}))

describe('useAnnouncements', () => {
  beforeEach(() => {
    vi.mocked(announce).mockClear()
  })

  afterEach(() => {
    // Tests using fake timers restore real timers themselves, but make sure
    // a failure can never leak fake timers into the next test.
    vi.useRealTimers()
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

    const {result} = renderHook(() =>
      useAnnouncements([{text: 'Start date'}], listRef, {current: input}, true, false, undefined, 'active-descendant'),
    )

    act(() => {
      result.current()
      listRef.current = list
    })

    await expect
      .poll(() => announce)
      .toHaveBeenCalledWith(
        'Filter fields, filter text box and list of items, Focused item: Start date, not selected, 1 of 1',
        {delayMs: 500, from: undefined},
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

    const {result} = renderHook(() =>
      useAnnouncements(
        [{text: 'Start date'}],
        {current: list},
        {current: input},
        true,
        false,
        undefined,
        'active-descendant',
      ),
    )

    act(() => result.current())

    await expect
      .poll(() => announce)
      .toHaveBeenCalledWith(
        'Issue fields, filter text box and list of items, Focused item: Start date, not selected, 1 of 1',
        {delayMs: 500, from: undefined},
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

    const {result} = renderHook(() =>
      useAnnouncements(
        [{text: 'Start date'}],
        {current: list},
        {current: input},
        true,
        false,
        undefined,
        'active-descendant',
      ),
    )

    act(() => result.current())

    await expect
      .poll(() => announce)
      .toHaveBeenCalledWith(
        'Filter fields, filter text box and list of items, Focused item: Start date, not selected, 1 of 1',
        {delayMs: 500, from: undefined},
      )

    label.remove()
    input.remove()
  })

  it('does not announce when items are recreated with the same announcement state', () => {
    const list = document.createElement('ul')
    const activeOption = document.createElement('li')
    activeOption.setAttribute('role', 'option')
    activeOption.setAttribute('data-is-active-descendant', 'true')
    list.append(activeOption)

    const {rerender} = renderHook(
      ({items}) =>
        useAnnouncements(items, {current: list}, {current: null}, true, false, undefined, 'active-descendant'),
      {initialProps: {items: [{id: 'start-date', text: 'Start date', selected: false}]}},
    )

    rerender({items: [{id: 'start-date', text: 'Start date', selected: false}]})

    expect(announce).not.toHaveBeenCalled()
  })

  it('announces an unchanged empty state when the filter value changes', async () => {
    const message = {title: 'Nothing found', description: "There's nothing here."}
    const {rerender} = renderHook(
      ({filterValue}) =>
        useAnnouncements([], {current: null}, {current: null}, true, false, message, 'active-descendant', filterValue),
      {initialProps: {filterValue: ''}},
    )

    rerender({filterValue: 'zero'})

    await expect.poll(() => announce).toHaveBeenCalledWith("Nothing found. There's nothing here.", {delayMs: 500})
  })

  it('debounces list update announcements while the filter value changes rapidly', () => {
    const {rerender} = renderHook(
      ({filterValue, items}) =>
        useAnnouncements(
          items,
          {current: null},
          {current: null},
          true,
          false,
          undefined,
          'roving-tabindex',
          filterValue,
        ),
      {
        initialProps: {
          filterValue: '',
          items: [{id: 'start-date', text: 'Start date', selected: false}],
        },
      },
    )

    vi.useFakeTimers()

    // First update schedules an announcement for one item; it must not
    // fire before the 250ms debounce window elapses.
    rerender({
      filterValue: 's',
      items: [{id: 'start-date', text: 'Start date', selected: false}],
    })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(announce).not.toHaveBeenCalled()

    // A second update inside the window replaces the pending
    // announcement; the first text must never be announced.
    rerender({
      filterValue: 'st',
      items: [
        {id: 'start-date', text: 'Start date', selected: false},
        {id: 'end-date', text: 'End date', selected: false},
      ],
    })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(announce).not.toHaveBeenCalled()

    // A third update replaces it again; advancing past the deadline from
    // the last update fires exactly once, with the latest text.
    rerender({
      filterValue: 'sta',
      items: [
        {id: 'start-date', text: 'Start date', selected: false},
        {id: 'end-date', text: 'End date', selected: false},
        {id: 'due-date', text: 'Due date', selected: false},
      ],
    })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(announce).not.toHaveBeenCalled()
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(announce).toHaveBeenCalledTimes(1)
    expect(announce).toHaveBeenCalledWith('3 items available, 0 selected.', {delayMs: 500, from: undefined})

    vi.useRealTimers()
  })

  it('still announces list updates after StrictMode replays effects on mount', () => {
    vi.useFakeTimers()
    const {rerender} = renderHook(
      ({filterValue}) =>
        useAnnouncements(
          [{id: 'start-date', text: 'Start date', selected: false}],
          {current: null},
          {current: null},
          true,
          false,
          undefined,
          'roving-tabindex',
          filterValue,
        ),
      {
        initialProps: {filterValue: ''},
        wrapper: ({children}: {children: React.ReactNode}) => <StrictMode>{children}</StrictMode>,
      },
    )

    // With the previous memoized debouncer, StrictMode's mount cleanup
    // permanently disabled it, so this update was never announced.
    rerender({filterValue: 's'})
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(announce).toHaveBeenCalledTimes(1)
    expect(announce).toHaveBeenCalledWith('1 item available, 0 selected.', {delayMs: 500, from: undefined})

    vi.useRealTimers()
  })

  it.each([100, 250])('cancels list-update delivery when unmounted after %i ms', async elapsed => {
    const {announce: announceToLiveRegion} = await vi.importActual<{announce: typeof announce}>(
      '@primer/live-region-element',
    )
    const liveRegion = document.createElement('live-region')
    document.body.append(liveRegion)
    vi.mocked(announce).mockImplementation(announceToLiveRegion)
    vi.useFakeTimers()

    try {
      const {rerender, unmount} = renderHook(
        ({filterValue}) =>
          useAnnouncements(
            [{text: 'Start date'}],
            {current: null},
            {current: null},
            true,
            false,
            undefined,
            'roving-tabindex',
            filterValue,
          ),
        {initialProps: {filterValue: ''}},
      )

      rerender({filterValue: 's'})
      await act(() => vi.advanceTimersByTimeAsync(elapsed))
      expect(announce).toHaveBeenCalledTimes(elapsed === 250 ? 1 : 0)
      unmount()
      await act(() => vi.advanceTimersByTimeAsync(1000))
      expect(liveRegion.getMessage('polite')).toBe('')
    } finally {
      vi.mocked(announce).mockReset()
      liveRegion.remove()
    }
  })

  it('cancels a queued list update when announcements are disabled without a content change', () => {
    vi.useFakeTimers()
    const {rerender} = renderHook(
      ({enabled, filterValue}) =>
        useAnnouncements(
          [{text: 'Start date'}],
          {current: null},
          {current: null},
          enabled,
          false,
          undefined,
          'roving-tabindex',
          filterValue,
        ),
      {initialProps: {enabled: true, filterValue: ''}},
    )

    rerender({enabled: true, filterValue: 's'})
    act(() => vi.advanceTimersByTime(100))
    rerender({enabled: false, filterValue: 's'})
    act(() => vi.advanceTimersByTime(1000))
    expect(announce).not.toHaveBeenCalled()

    rerender({enabled: true, filterValue: 'st'})
    act(() => vi.advanceTimersByTime(250))
    expect(announce).toHaveBeenCalledTimes(1)
  })

  it('announces current focus once after the final active-descendant list update', () => {
    vi.useFakeTimers({toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'clearTimeout']})
    const list = document.createElement('ul')
    const start = document.createElement('li')
    start.setAttribute('role', 'option')
    start.setAttribute('data-is-active-descendant', 'true')
    start.textContent = 'Start date'
    const end = document.createElement('li')
    end.setAttribute('role', 'option')
    end.textContent = 'End date'
    list.append(start, end)

    const {rerender} = renderHook(
      ({filterValue}) =>
        useAnnouncements(
          [{text: 'Start date'}, {text: 'End date', selected: true}],
          {current: list},
          {current: null},
          true,
          false,
          undefined,
          'active-descendant',
          filterValue,
        ),
      {initialProps: {filterValue: ''}},
    )

    rerender({filterValue: 's'})
    act(() => vi.advanceTimersToNextFrame())
    act(() => vi.advanceTimersByTime(100))
    rerender({filterValue: 'st'})
    rerender({filterValue: 'sta'})
    act(() => vi.advanceTimersToNextFrame())

    start.removeAttribute('data-is-active-descendant')
    end.setAttribute('data-is-active-descendant', 'true')
    act(() => vi.advanceTimersByTime(249))
    expect(announce).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))
    expect(announce).toHaveBeenCalledExactlyOnceWith('List updated, Focused item: End date, selected, 2 of 2', {
      delayMs: 500,
      from: undefined,
    })
  })

  it('cancels a queued empty-result announcement when a new query starts loading', () => {
    vi.useFakeTimers()
    const message = {title: 'Nothing found', description: "There's nothing here."}
    const {rerender} = renderHook(
      ({loading, filterValue}) =>
        useAnnouncements(
          [],
          {current: null},
          {current: null},
          true,
          loading,
          message,
          'active-descendant',
          filterValue,
        ),
      {initialProps: {loading: false, filterValue: ''}},
    )

    // Queue the empty-result announcement.
    rerender({loading: false, filterValue: 'zero'})
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(announce).not.toHaveBeenCalled()

    // A new query starts loading before the window elapses; the stale
    // "Nothing found" message must not be announced.
    rerender({loading: true, filterValue: 'zero'})
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(announce).not.toHaveBeenCalled()

    vi.useRealTimers()
  })
})
