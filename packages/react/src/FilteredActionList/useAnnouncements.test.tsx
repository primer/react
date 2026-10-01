import {act, renderHook, waitFor} from '@testing-library/react'
import {announce} from '@primer/live-region-element'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {useAnnouncements} from './useAnnouncements'

vi.mock('@primer/live-region-element', () => ({
  announce: vi.fn(),
}))

describe('useAnnouncements', () => {
  beforeEach(() => {
    vi.mocked(announce).mockClear()
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

    await waitFor(() =>
      expect(announce).toHaveBeenCalledWith(
        'Filter fields, filter text box and list of items, Focused item: Start date, not selected, 1 of 1',
        {delayMs: 500, from: undefined},
      ),
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

    await waitFor(() =>
      expect(announce).toHaveBeenCalledWith(
        'Issue fields, filter text box and list of items, Focused item: Start date, not selected, 1 of 1',
        {delayMs: 500, from: undefined},
      ),
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

    await waitFor(() =>
      expect(announce).toHaveBeenCalledWith(
        'Filter fields, filter text box and list of items, Focused item: Start date, not selected, 1 of 1',
        {delayMs: 500, from: undefined},
      ),
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

    await waitFor(() => expect(announce).toHaveBeenCalledWith("Nothing found. There's nothing here.", {delayMs: 500}))
  })
})
