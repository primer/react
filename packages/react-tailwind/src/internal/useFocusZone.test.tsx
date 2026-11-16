import type React from 'react'
import {act, cleanup, fireEvent, render, renderHook, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it} from 'vitest'
import {focusZone, useFocusZone, type UseFocusZoneOptions} from './useFocusZone'

afterEach(cleanup)

function Zone({children, ...options}: UseFocusZoneOptions & {children: React.ReactNode}) {
  const ref = useFocusZone<HTMLDivElement>(options)
  return (
    <div ref={ref} data-testid="zone">
      {children}
    </div>
  )
}

function Buttons({count = 3}: {count?: number}) {
  return Array.from({length: count}, (_, index) => (
    <button key={index} type="button">
      {`Item ${index + 1}`}
    </button>
  ))
}

const item = (number: number) => screen.getByRole('button', {name: `Item ${number}`})
const tabIndexes = () => screen.getAllByRole('button').map(button => button.getAttribute('tabindex'))

describe('useFocusZone', () => {
  it('keeps one element in the tab order and moves focus with the bound arrow keys', async () => {
    const user = userEvent.setup()
    render(
      <Zone bindKeys={['ArrowVertical']}>
        <Buttons />
      </Zone>,
    )
    expect(tabIndexes()).toEqual(['0', '-1', '-1'])

    await user.tab()
    expect(item(1)).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(item(2)).toHaveFocus()
    expect(tabIndexes()).toEqual(['-1', '0', '-1'])
    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(item(3)).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(item(2)).toHaveFocus()

    await user.keyboard('{ArrowRight}{Home}')
    expect(item(2)).toHaveFocus()
  })

  it('wraps past either end only when asked to', async () => {
    const user = userEvent.setup()
    render(
      <Zone bindKeys={['ArrowHorizontal']} focusOutBehavior="wrap">
        <Buttons />
      </Zone>,
    )
    act(() => item(3).focus())
    await user.keyboard('{ArrowRight}')
    expect(item(1)).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(item(3)).toHaveFocus()
  })

  it('jumps to either end with Home, End, Page Up, Page Down, and modified arrows', async () => {
    const user = userEvent.setup()
    render(
      <Zone bindKeys={['ArrowVertical', 'HomeAndEnd', 'PageUpDown']}>
        <Buttons count={4} />
      </Zone>,
    )
    act(() => item(2).focus())
    await user.keyboard('{End}')
    expect(item(4)).toHaveFocus()
    await user.keyboard('{Home}')
    expect(item(1)).toHaveFocus()
    await user.keyboard('{PageDown}')
    expect(item(4)).toHaveFocus()
    await user.keyboard('{PageUp}')
    expect(item(1)).toHaveFocus()
    await user.keyboard('{Control>}{ArrowDown}{/Control}')
    expect(item(4)).toHaveFocus()
  })

  it('cancels the keys it handles and lets Tab leave from either end', () => {
    render(
      <Zone bindKeys={['ArrowHorizontal', 'Tab']}>
        <Buttons count={2} />
      </Zone>,
    )
    act(() => item(1).focus())
    expect(fireEvent.keyDown(item(1), {key: 'ArrowLeft'})).toBe(false)
    expect(fireEvent.keyDown(item(1), {key: 'Tab', shiftKey: true})).toBe(true)
    expect(fireEvent.keyDown(item(1), {key: 'Tab'})).toBe(false)
    expect(item(2)).toHaveFocus()
    expect(fireEvent.keyDown(item(2), {key: 'Tab'})).toBe(true)
    expect(item(2)).toHaveFocus()
    expect(fireEvent.keyDown(item(2), {key: 'Escape'})).toBe(true)
  })

  it('leaves keys that were already handled alone', () => {
    render(
      <Zone bindKeys={['ArrowVertical']}>
        <Buttons count={2} />
      </Zone>,
    )
    act(() => item(1).focus())
    item(1).addEventListener('keydown', event => event.preventDefault())
    fireEvent.keyDown(item(1), {key: 'ArrowDown'})
    expect(item(1)).toHaveFocus()
  })

  it('skips disabled, hidden, inert, and aria-hidden elements but keeps aria-disabled ones', async () => {
    const user = userEvent.setup()
    render(
      <Zone bindKeys={['ArrowVertical']}>
        <button type="button">First</button>
        <button type="button" disabled>
          Disabled
        </button>
        <button type="button" hidden>
          Hidden
        </button>
        <div aria-hidden="true">
          <button type="button">Aria hidden</button>
        </div>
        <div inert>
          <button type="button">Inert</button>
        </div>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid -- verifies that anchors without href are skipped */}
        <a>No href</a>
        <span>Static</span>
        <button type="button" aria-disabled="true">
          Aria disabled
        </button>
        <a href="#link">Link</a>
        <span tabIndex={-1}>Programmatic</span>
      </Zone>,
    )
    act(() => screen.getByRole('button', {name: 'First'}).focus())
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('button', {name: 'Aria disabled'})).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('link', {name: 'Link'})).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByText('Programmatic')).toHaveFocus()
    expect(screen.getByRole('button', {name: 'Disabled'})).not.toHaveAttribute('tabindex')
    expect(screen.getByText('Static')).not.toHaveAttribute('tabindex')
  })

  it('leaves caret and value keys to text fields and selects', async () => {
    const user = userEvent.setup()
    render(
      <Zone bindKeys={['ArrowHorizontal', 'ArrowVertical', 'HomeAndEnd']}>
        <input aria-label="Text" defaultValue="abc" />
        <select aria-label="Choice">
          <option>One</option>
          <option>Two</option>
        </select>
        <input aria-label="Read only" defaultValue="abc" readOnly />
        <input aria-label="Check" type="checkbox" />
      </Zone>,
    )
    const text = screen.getByRole<HTMLInputElement>('textbox', {name: 'Text'})
    act(() => text.focus())
    text.setSelectionRange(1, 1)
    await user.keyboard('{ArrowLeft}')
    expect(text).toHaveFocus()
    await user.keyboard('{End}')
    expect(text).toHaveFocus()
    text.setSelectionRange(3, 3)
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('combobox', {name: 'Choice'})).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('combobox', {name: 'Choice'})).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('textbox', {name: 'Read only'})).toHaveFocus()
    await user.keyboard('{End}')
    expect(screen.getByRole('checkbox', {name: 'Check'})).toHaveFocus()
    await user.keyboard('{Home}')
    expect(text).toHaveFocus()
  })

  it('returns to the most recently focused element by default', async () => {
    const user = userEvent.setup()
    render(
      <>
        <button type="button">Before</button>
        <Zone bindKeys={['ArrowVertical']}>
          <Buttons />
        </Zone>
        <button type="button">After</button>
      </>,
    )
    act(() => item(1).focus())
    await user.keyboard('{ArrowDown}')
    await user.tab()
    expect(screen.getByRole('button', {name: 'After'})).toHaveFocus()
    await user.tab({shift: true})
    expect(item(2)).toHaveFocus()
  })

  it('enters at the nearest end when Tab moves focus in with the closest strategy', async () => {
    const user = userEvent.setup()
    render(
      <>
        <button type="button">Before</button>
        <Zone bindKeys={['ArrowHorizontal', 'Tab']} focusInStrategy="closest">
          <Buttons />
        </Zone>
        <button type="button">After</button>
      </>,
    )
    act(() => item(2).focus())
    act(() => screen.getByRole('button', {name: 'After'}).focus())
    await user.tab({shift: true})
    expect(item(3)).toHaveFocus()

    act(() => item(2).focus())
    act(() => screen.getByRole('button', {name: 'Before'}).focus())
    await user.tab()
    expect(item(1)).toHaveFocus()

    act(() => screen.getByRole('button', {name: 'Before'}).focus())
    act(() => item(2).focus())
    expect(item(2)).toHaveFocus()
  })

  it('tracks elements that are added, removed, or disabled later', async () => {
    function Dynamic({count, disableFirst}: {count: number; disableFirst?: boolean}) {
      return (
        <Zone bindKeys={['ArrowVertical']}>
          {Array.from({length: count}, (_, index) => (
            <button key={index} type="button" disabled={index === 0 && disableFirst}>
              {`Item ${index + 1}`}
            </button>
          ))}
        </Zone>
      )
    }
    const {rerender} = render(<Dynamic count={2} />)
    rerender(<Dynamic count={3} />)
    await waitFor(() => expect(item(3)).toHaveAttribute('tabindex', '-1'))

    rerender(<Dynamic count={3} disableFirst />)
    await waitFor(() => expect(item(2)).toHaveAttribute('tabindex', '0'))
    expect(item(1)).not.toHaveAttribute('tabindex')
  })

  it('adopts tabindex values written by others and restores them on cleanup', async () => {
    const container = document.createElement('div')
    // eslint-disable-next-line github/unescaped-html-literal
    container.innerHTML = '<button>A</button><button tabindex="0">B</button><span tabindex="-1">C</span>'
    document.body.append(container)
    const [a, b, c] = Array.from(container.children) as HTMLElement[]
    const stop = focusZone(container, {bindKeys: ['ArrowVertical']})
    expect([a, b, c].map(element => element.getAttribute('tabindex'))).toEqual(['0', '-1', '-1'])

    b.setAttribute('tabindex', '-1')
    c.setAttribute('tabindex', '0')
    await waitFor(() => expect(c).toHaveAttribute('tabindex', '-1'))

    stop()
    expect(a).not.toHaveAttribute('tabindex')
    expect(b).toHaveAttribute('tabindex', '-1')
    expect(c).toHaveAttribute('tabindex', '0')
    expect(fireEvent.keyDown(a, {key: 'ArrowDown'})).toBe(true)
    container.remove()
  })

  it('restores the tab order when disabled', () => {
    const {rerender} = render(
      <Zone bindKeys={['ArrowVertical']}>
        <Buttons count={2} />
      </Zone>,
    )
    expect(tabIndexes()).toEqual(['0', '-1'])
    rerender(
      <Zone bindKeys={['ArrowVertical']} disabled>
        <Buttons count={2} />
      </Zone>,
    )
    expect(tabIndexes()).toEqual([null, null])
  })

  it('tears the zone down when the ref detaches, without returning a cleanup', () => {
    const container = document.createElement('div')
    // eslint-disable-next-line github/unescaped-html-literal
    container.innerHTML = '<button>A</button><button>B</button>'
    document.body.append(container)
    const [a, b] = Array.from(container.children) as HTMLElement[]
    const {result} = renderHook(() => useFocusZone<HTMLDivElement>({bindKeys: ['ArrowVertical']}))

    expect(result.current(container)).toBeUndefined()
    expect([a, b].map(element => element.getAttribute('tabindex'))).toEqual(['0', '-1'])

    expect(result.current(null)).toBeUndefined()
    expect([a, b].map(element => element.getAttribute('tabindex'))).toEqual([null, null])
    expect(fireEvent.keyDown(a, {key: 'ArrowDown'})).toBe(true)
    container.remove()
  })
})
