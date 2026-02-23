import {describe, expect, it} from 'vitest'
import type React from 'react'
import {Fragment, useState} from 'react'
import {act, render} from '@testing-library/react'
import {createDescendantRegistry} from '../descendant-registry'

/**
 * Creates a fresh registry instance with isolated helper components for each test. This ensures
 * no state leaks between tests via a shared Context or Provider.
 */
function createTestRegistry() {
  const {Provider, useRegistryState, useRegisterDescendant} = createDescendantRegistry<string>()

  /**
   * Parent component that exposes the registry values in the DOM for assertions.
   * State is held here and passed down to the Provider.
   */
  function RegistryParent({children}: {children: React.ReactNode}) {
    const [registryState, setRegistry] = useRegistryState()

    return (
      <>
        <div data-testid="registry-values">{Array.from(registryState.values()).join(',')}</div>
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
  it('registers descendant items inside of other components', () => {
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

    expect(getByTestId('registry-values').textContent).toBe('a,b,c')
  })

  it('registers descendant items inside of React fragments', () => {
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

    expect(getByTestId('registry-values').textContent).toBe('a,b,c')
  })

  it('registers items added to the middle of children after initial render', () => {
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
    expect(getByTestId('registry-values').textContent).toBe('a,b')

    act(() => {
      getByRole('button').click()
    })

    expect(getByTestId('registry-values').textContent).toBe('a,middle,b')
  })

  it('drops items from the registry after they unmount', () => {
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
    expect(getByTestId('registry-values').textContent).toBe('a,b,c')

    act(() => {
      getByRole('button').click()
    })

    expect(getByTestId('registry-values').textContent).toBe('a,b')
  })

  it('updates registry order when items are reordered, using key to maintain component mount', () => {
    const {RegistryParent, Item} = createTestRegistry()

    function Test() {
      const [items, setItems] = useState(['a', 'b', 'c'])
      return (
        <RegistryParent>
          {items.map(item => (
            <Item key={item} value={item} />
          ))}
          <button type="button" onClick={() => setItems(['c', 'a', 'b'])}>
            Reorder
          </button>
        </RegistryParent>
      )
    }

    const {getByTestId, getByRole} = render(<Test />)
    expect(getByTestId('registry-values').textContent).toBe('a,b,c')

    act(() => {
      getByRole('button').click()
    })

    expect(getByTestId('registry-values').textContent).toBe('c,a,b')
  })

  it('registers deep descendants added to the beginning of the tree after initial render', () => {
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
    expect(getByTestId('registry-values').textContent).toBe('second,third')

    act(() => {
      getByRole('button').click()
    })

    expect(getByTestId('registry-values').textContent).toBe('first,second,third')
  })
})
