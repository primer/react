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
    const activeOption = document.createElement('li')
    activeOption.setAttribute('role', 'option')
    activeOption.setAttribute('data-is-active-descendant', 'true')
    activeOption.textContent = 'Start date'
    list.append(activeOption)
    const listRef: {current: HTMLUListElement | null} = {current: null}

    renderHook(() =>
      useAnnouncements([{text: 'Start date'}], listRef, {current: input}, true, false, undefined, 'active-descendant'),
    )

    act(() => {
      input.dispatchEvent(new FocusEvent('focus'))
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
    const activeOption = document.createElement('li')
    activeOption.setAttribute('role', 'option')
    activeOption.setAttribute('data-is-active-descendant', 'true')
    activeOption.textContent = 'Start date'
    list.append(activeOption)

    renderHook(() =>
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

    act(() => input.dispatchEvent(new FocusEvent('focus')))

    await waitFor(() =>
      expect(announce).toHaveBeenCalledWith(
        'Issue fields, filter text box and list of items, Focused item: Start date, not selected, 1 of 1',
        {delayMs: 500, from: undefined},
      ),
    )

    label.remove()
  })

  it('does not invent an input label when the input is unavailable', async () => {
    const list = document.createElement('ul')
    const activeOption = document.createElement('li')
    activeOption.setAttribute('role', 'option')
    activeOption.setAttribute('data-is-active-descendant', 'true')
    activeOption.textContent = 'Start date'
    list.append(activeOption)

    const inputRef = {current: null}
    const {rerender} = renderHook(
      ({items}) => useAnnouncements(items, {current: list}, inputRef, true, false, undefined, 'active-descendant'),
      {initialProps: {items: [{text: 'Start date'}]}},
    )

    rerender({items: [{text: 'Start date'}, {text: 'Priority'}]})

    await waitFor(() =>
      expect(announce).toHaveBeenCalledWith('List updated, Focused item: Start date, not selected, 1 of 2', {
        delayMs: 500,
        from: undefined,
      }),
    )
  })
})
