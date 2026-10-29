import {describe, expect, it, vi} from 'vitest'
import type React from 'react'
import {Fragment, useEffect, useState} from 'react'
import {act, render, waitFor} from '@testing-library/react'
import {createDescendantRegistry} from '../descendant-registry'
import {userEvent} from '@testing-library/user-event'

/**
 * Creates a fresh registry instance with isolated helper components for each test. This ensures
 * no state leaks between tests via a shared Context or Provider.
 */
function createTestRegistry({onRegistryRender}: {onRegistryRender?: () => void} = {}) {
  const {Provider, useRegistryState, useRegisterDescendant} = createDescendantRegistry<string>()

  /**
   * Parent component that exposes the registry values in the DOM for assertions.
   * State is held here and passed down to the Provider.
   */
  function RegistryParent({children}: {children: React.ReactNode}) {
    onRegistryRender?.()
    const [registryState, setRegistry] = useRegistryState()

    return (
      <>
        <div data-testid="registry-values">{Array.from(registryState?.values() ?? []).join(',')}</div>
        <Provider setRegistry={setRegistry}>{children}</Provider>
      </>
    )
  }

  /** A leaf component that registers itself as a descendant. */
  function Item({value}: {value: string}) {
    useRegisterDescendant(value)
    return null
  }

  return {RegistryParent, Item}
}

describe('createDescendantRegistry', () => {
  it('publishes the initial registry within the descendant effect flush', () => {
    const onRegistryRender = vi.fn()
    const {RegistryParent, Item} = createTestRegistry({onRegistryRender})

    const {getByTestId} = render(
      <RegistryParent>
        <Item value="a" />
      </RegistryParent>,
    )

    expect(getByTestId('registry-values').textContent).toBe('a')
    expect(onRegistryRender).toHaveBeenCalledTimes(2)
  })

  it('registers descendant items inside of other components', async () => {
    const {RegistryParent, Item} = createTestRegistry()

    function Wrapper({value}: {value: string}) {
      return <Item value={value} />
    }

    const {getByTestId} = render(
      <RegistryParent>
        <Wrapper value="a" />
        <Wrapper value="b" />
        <Wrapper value="c" />
      </RegistryParent>,
    )

    await waitFor(() => expect(getByTestId('registry-values').textContent).toBe('a,b,c'))
  })

  it('registers descendant items inside of React fragments', async () => {
    const {RegistryParent, Item} = createTestRegistry()

    const {getByTestId} = render(
      <RegistryParent>
        <Fragment>
          <Item value="a" />
          <Item value="b" />
        </Fragment>
        <Item value="c" />
      </RegistryParent>,
    )

    await waitFor(() => expect(getByTestId('registry-values').textContent).toBe('a,b,c'))
  })

  it('updates item values on change', async () => {
    const {RegistryParent, Item} = createTestRegistry()

    function Test() {
      const [middleValue, setMiddleValue] = useState('middle')
      return (
        <RegistryParent>
          <Item value="a" />
          <Item value={middleValue} />
          <Item value="b" />
          <button type="button" onClick={() => setMiddleValue('c')}>
            Update middle
          </button>
        </RegistryParent>
      )
    }

    const {getByTestId, getByRole} = render(<Test />)
    await waitFor(() => expect(getByTestId('registry-values').textContent).toBe('a,middle,b'))

    await userEvent.click(getByRole('button'))

    await waitFor(() => expect(getByTestId('registry-values').textContent).toBe('a,c,b'))
  })

  it('registers items added to the middle of children after initial render', async () => {
    const {RegistryParent, Item} = createTestRegistry()

    function Test() {
      const [showMiddle, setShowMiddle] = useState(false)
      return (
        <RegistryParent>
          <Item value="a" />
          {showMiddle && <Item value="middle" />}
          <Item value="b" />
          <button type="button" onClick={() => setShowMiddle(true)}>
            Add middle
          </button>
        </RegistryParent>
      )
    }

    const {getByTestId, getByRole} = render(<Test />)
    await waitFor(() => expect(getByTestId('registry-values').textContent).toBe('a,b'))

    await userEvent.click(getByRole('button'))

    await waitFor(() => expect(getByTestId('registry-values').textContent).toBe('a,middle,b'))
  })

  it('coalesces multiple descendants added in a single update into one correct rebuild', async () => {
    const {RegistryParent, Item} = createTestRegistry()

    function Test() {
      const [expanded, setExpanded] = useState(false)
      return (
        <RegistryParent>
          <Item value="a" />
          {expanded && (
            <>
              <Item value="b" />
              <Item value="c" />
              <Item value="d" />
            </>
          )}
          <Item value="e" />
          <button type="button" onClick={() => setExpanded(true)}>
            Expand
          </button>
        </RegistryParent>
      )
    }

    const {getByTestId, getByRole} = render(<Test />)
    await waitFor(() => expect(getByTestId('registry-values').textContent).toBe('a,e'))

    // Several descendants register in the same tick; the coalesced rebuild must still capture all of them in order.
    await userEvent.click(getByRole('button'))

    await waitFor(() => expect(getByTestId('registry-values').textContent).toBe('a,b,c,d,e'))
  })

  it('preserves all descendants when the parent rerenders before a queued rebuild', async () => {
    const {RegistryParent, Item} = createTestRegistry()

    function Test({values}: {values: string[]}) {
      return (
        <RegistryParent>
          {values.map(value => (
            <Item key={value} value={value} />
          ))}
        </RegistryParent>
      )
    }

    const {getByTestId, rerender} = render(<Test values={['a', 'd']} />)
    expect(getByTestId('registry-values').textContent).toBe('a,d')

    // Both parent commits must finish before the scheduled rebuild runs.
    rerender(<Test values={['a', 'b', 'd']} />)
    rerender(<Test values={['a', 'b', 'c', 'd']} />)

    await waitFor(() => expect(getByTestId('registry-values').textContent).toBe('a,b,c,d'))
  })

  it('drops items from the registry after they unmount', async () => {
    const {RegistryParent, Item} = createTestRegistry()

    function Test() {
      const [showLast, setShowLast] = useState(true)
      return (
        <RegistryParent>
          <Item value="a" />
          <Item value="b" />
          {showLast && <Item value="c" />}
          <button type="button" onClick={() => setShowLast(false)}>
            Remove last
          </button>
        </RegistryParent>
      )
    }

    const {getByTestId, getByRole} = render(<Test />)
    await waitFor(() => expect(getByTestId('registry-values').textContent).toBe('a,b,c'))

    await userEvent.click(getByRole('button'))

    await waitFor(() => expect(getByTestId('registry-values').textContent).toBe('a,b'))
  })

  it('batches rapid value updates and unregisters into one registry render', async () => {
    const onRegistryRender = vi.fn()
    const {RegistryParent, Item} = createTestRegistry({onRegistryRender})
    type TestItem = {id: string; value: string}
    let setItems: React.Dispatch<React.SetStateAction<TestItem[]>> | null = null

    function Items() {
      const [items, setItemState] = useState<TestItem[]>([
        {id: 'a', value: 'a'},
        {id: 'b', value: 'b'},
        {id: 'c', value: 'c'},
      ])
      useEffect(() => {
        setItems = setItemState
        return () => {
          setItems = null
        }
      }, [])
      return items.map(item => <Item key={item.id} value={item.value} />)
    }

    const {getByTestId} = render(
      <RegistryParent>
        <Items />
      </RegistryParent>,
    )
    await waitFor(() => expect(getByTestId('registry-values').textContent).toBe('a,b,c'))
    onRegistryRender.mockClear()

    act(() =>
      setItems!([
        {id: 'a', value: 'a'},
        {id: 'b', value: 'b-1'},
        {id: 'c', value: 'c'},
      ]),
    )
    act(() =>
      setItems!([
        {id: 'a', value: 'a'},
        {id: 'b', value: 'b-2'},
        {id: 'c', value: 'c'},
      ]),
    )
    act(() =>
      setItems!([
        {id: 'a', value: 'a'},
        {id: 'c', value: 'c-latest'},
      ]),
    )

    await waitFor(() => expect(getByTestId('registry-values').textContent).toBe('a,c-latest'))
    expect(onRegistryRender).toHaveBeenCalledTimes(1)
  })

  it('keeps final ordering when descendants rapidly mount, update, and unmount before a rebuild', async () => {
    const onRegistryRender = vi.fn()
    const {RegistryParent, Item} = createTestRegistry({onRegistryRender})
    type TestItem = {id: string; value: string}
    let setItems: React.Dispatch<React.SetStateAction<TestItem[]>> | null = null

    function Items() {
      const [items, setItemState] = useState<TestItem[]>([
        {id: 'a', value: 'a'},
        {id: 'd', value: 'd'},
      ])
      useEffect(() => {
        setItems = setItemState
        return () => {
          setItems = null
        }
      }, [])
      return items.map(item => <Item key={item.id} value={item.value} />)
    }

    const {getByTestId} = render(
      <RegistryParent>
        <Items />
      </RegistryParent>,
    )
    await waitFor(() => expect(getByTestId('registry-values').textContent).toBe('a,d'))
    onRegistryRender.mockClear()

    act(() =>
      setItems!([
        {id: 'a', value: 'a'},
        {id: 'b', value: 'b'},
        {id: 'd', value: 'd'},
      ]),
    )
    act(() =>
      setItems!([
        {id: 'a', value: 'a'},
        {id: 'b', value: 'b-latest'},
        {id: 'c', value: 'c'},
        {id: 'd', value: 'd'},
      ]),
    )
    act(() =>
      setItems!([
        {id: 'a', value: 'a'},
        {id: 'c', value: 'c-updated'},
        {id: 'd', value: 'd'},
      ]),
    )
    act(() =>
      setItems!([
        {id: 'a', value: 'a'},
        {id: 'd', value: 'd'},
        {id: 'c', value: 'c-final'},
      ]),
    )

    await waitFor(() => expect(getByTestId('registry-values').textContent).toBe('a,d,c-final'))
    expect(onRegistryRender).toHaveBeenCalledTimes(1)
  })

  it('batches rapid unregister and remount lifecycles without deleting the replacement', async () => {
    const onRegistryRender = vi.fn()
    const {RegistryParent, Item} = createTestRegistry({onRegistryRender})
    type TestItem = {id: string; value: string}
    let setItems: React.Dispatch<React.SetStateAction<TestItem[]>> | null = null

    function Items() {
      const [items, setItemState] = useState<TestItem[]>([
        {id: 'a', value: 'a'},
        {id: 'b', value: 'b'},
        {id: 'c', value: 'c'},
      ])
      useEffect(() => {
        setItems = setItemState
        return () => {
          setItems = null
        }
      }, [])
      return items.map(item => <Item key={item.id} value={item.value} />)
    }

    const {getByTestId} = render(
      <RegistryParent>
        <Items />
      </RegistryParent>,
    )
    await waitFor(() => expect(getByTestId('registry-values').textContent).toBe('a,b,c'))
    onRegistryRender.mockClear()

    act(() =>
      setItems!([
        {id: 'a', value: 'a'},
        {id: 'c', value: 'c'},
      ]),
    )
    act(() =>
      setItems!([
        {id: 'a', value: 'a'},
        {id: 'b', value: 'b-remounted'},
        {id: 'c', value: 'c'},
      ]),
    )
    act(() =>
      setItems!([
        {id: 'a', value: 'a'},
        {id: 'b', value: 'b-latest'},
        {id: 'c', value: 'c'},
      ]),
    )

    await waitFor(() => expect(getByTestId('registry-values').textContent).toBe('a,b-latest,c'))
    expect(onRegistryRender).toHaveBeenCalledTimes(1)
  })

  it('registers deep descendants added to the beginning of the tree after initial render', async () => {
    const {RegistryParent, Item} = createTestRegistry()

    function DeepItem({value}: {value: string}) {
      return (
        <div>
          <div>
            <Item value={value} />
          </div>
        </div>
      )
    }

    function Test() {
      const [showFirst, setShowFirst] = useState(false)
      return (
        <RegistryParent>
          {showFirst && <DeepItem value="first" />}
          <Item value="second" />
          <Item value="third" />
          <button type="button" onClick={() => setShowFirst(true)}>
            Add first
          </button>
        </RegistryParent>
      )
    }

    const {getByTestId, getByRole} = render(<Test />)
    await waitFor(() => expect(getByTestId('registry-values').textContent).toBe('second,third'))

    await userEvent.click(getByRole('button'))

    await waitFor(() => expect(getByTestId('registry-values').textContent).toBe('first,second,third'))
  })
})
