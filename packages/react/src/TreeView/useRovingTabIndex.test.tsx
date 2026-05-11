import {fireEvent, render, act, cleanup as cleanupRTL} from '@testing-library/react'
import {describe, it, expect, vi, afterEach} from 'vitest'
import React from 'react'
import {
  useRovingTabIndex,
  getElementState,
  getFirstChildElement,
  getParentElement,
  getFirstElement,
  getLastElement,
  getVisibleElement,
  getNextFocusableElement,
} from './useRovingTabIndex'

// Mock scrollIntoView since it's not implemented in JSDOM
Element.prototype.scrollIntoView = vi.fn()

function createTree(html: string): HTMLElement {
  const container = document.createElement('div')
  container.innerHTML = html.trim()
  document.body.appendChild(container)
  return container
}

function cleanup(container: HTMLElement) {
  document.body.removeChild(container)
}

describe('getElementState', () => {
  it('returns "open" for expanded treeitems', () => {
    const el = document.createElement('li')
    el.setAttribute('role', 'treeitem')
    el.setAttribute('aria-expanded', 'true')
    expect(getElementState(el)).toBe('open')
  })

  it('returns "closed" for collapsed treeitems', () => {
    const el = document.createElement('li')
    el.setAttribute('role', 'treeitem')
    el.setAttribute('aria-expanded', 'false')
    expect(getElementState(el)).toBe('closed')
  })

  it('returns "end" for treeitems without aria-expanded', () => {
    const el = document.createElement('li')
    el.setAttribute('role', 'treeitem')
    expect(getElementState(el)).toBe('end')
  })

  it('throws if element is not a treeitem', () => {
    const el = document.createElement('li')
    expect(() => getElementState(el)).toThrow('Element is not a treeitem')
  })
})

describe('getFirstChildElement', () => {
  it('returns the first child treeitem', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" aria-expanded="true" id="parent">
          Parent
          <ul role="group">
            <li role="treeitem" id="child-1">Child 1</li>
            <li role="treeitem" id="child-2">Child 2</li>
          </ul>
        </li>
      </ul>
    `)

    const parent = container.querySelector('#parent') as HTMLElement
    const firstChild = getFirstChildElement(parent)
    expect(firstChild?.id).toBe('child-1')
    cleanup(container)
  })

  it('returns undefined when there are no children', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" id="leaf">Leaf</li>
      </ul>
    `)

    const leaf = container.querySelector('#leaf') as HTMLElement
    expect(getFirstChildElement(leaf)).toBeUndefined()
    cleanup(container)
  })
})

describe('getParentElement', () => {
  it('returns the parent treeitem', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" aria-expanded="true" id="parent">
          Parent
          <ul role="group">
            <li role="treeitem" id="child">Child</li>
          </ul>
        </li>
      </ul>
    `)

    const child = container.querySelector('#child') as HTMLElement
    const parent = getParentElement(child)
    expect(parent?.id).toBe('parent')
    cleanup(container)
  })

  it('returns undefined for top-level treeitems', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" id="item">Item</li>
      </ul>
    `)

    const item = container.querySelector('#item') as HTMLElement
    expect(getParentElement(item)).toBeUndefined()
    cleanup(container)
  })
})

describe('getFirstElement', () => {
  it('returns the first treeitem in the tree', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" id="first">First</li>
        <li role="treeitem" id="second">Second</li>
        <li role="treeitem" id="third">Third</li>
      </ul>
    `)

    const second = container.querySelector('#second') as HTMLElement
    const first = getFirstElement(second)
    expect(first?.id).toBe('first')
    cleanup(container)
  })
})

describe('getLastElement', () => {
  it('returns the last visible treeitem in the tree', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" id="first">First</li>
        <li role="treeitem" id="second">Second</li>
        <li role="treeitem" id="third">Third</li>
      </ul>
    `)

    const first = container.querySelector('#first') as HTMLElement
    const last = getLastElement(first)
    expect(last?.id).toBe('third')
    cleanup(container)
  })

  it('skips treeitems inside collapsed subtrees', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" id="first">First</li>
        <li role="treeitem" aria-expanded="false" id="collapsed">
          Collapsed
          <ul role="group">
            <li role="treeitem" id="hidden-child">Hidden Child</li>
          </ul>
        </li>
        <li role="treeitem" id="visible-last">Visible Last</li>
      </ul>
    `)

    const first = container.querySelector('#first') as HTMLElement
    const last = getLastElement(first)
    expect(last?.id).toBe('visible-last')
    cleanup(container)
  })
})

describe('getVisibleElement', () => {
  it('returns the next visible treeitem', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" id="item-1">Item 1</li>
        <li role="treeitem" id="item-2">Item 2</li>
        <li role="treeitem" id="item-3">Item 3</li>
      </ul>
    `)

    const item1 = container.querySelector('#item-1') as HTMLElement
    const next = getVisibleElement(item1, 'next')
    expect(next?.id).toBe('item-2')
    cleanup(container)
  })

  it('returns the previous visible treeitem', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" id="item-1">Item 1</li>
        <li role="treeitem" id="item-2">Item 2</li>
        <li role="treeitem" id="item-3">Item 3</li>
      </ul>
    `)

    const item3 = container.querySelector('#item-3') as HTMLElement
    const prev = getVisibleElement(item3, 'previous')
    expect(prev?.id).toBe('item-2')
    cleanup(container)
  })

  it('returns undefined at the end of the tree', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" id="item-1">Item 1</li>
        <li role="treeitem" id="item-2">Item 2</li>
      </ul>
    `)

    const item2 = container.querySelector('#item-2') as HTMLElement
    expect(getVisibleElement(item2, 'next')).toBeUndefined()
    cleanup(container)
  })

  it('returns undefined at the start of the tree', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" id="item-1">Item 1</li>
        <li role="treeitem" id="item-2">Item 2</li>
      </ul>
    `)

    const item1 = container.querySelector('#item-1') as HTMLElement
    expect(getVisibleElement(item1, 'previous')).toBeUndefined()
    cleanup(container)
  })

  it('skips treeitems inside collapsed subtrees', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" id="item-1">Item 1</li>
        <li role="treeitem" aria-expanded="false" id="collapsed">
          Collapsed
          <ul role="group">
            <li role="treeitem" id="hidden">Hidden</li>
          </ul>
        </li>
        <li role="treeitem" id="item-3">Item 3</li>
      </ul>
    `)

    const item1 = container.querySelector('#item-1') as HTMLElement
    const next = getVisibleElement(item1, 'next')
    expect(next?.id).toBe('collapsed')

    const collapsed = container.querySelector('#collapsed') as HTMLElement
    const nextAfterCollapsed = getVisibleElement(collapsed, 'next')
    expect(nextAfterCollapsed?.id).toBe('item-3')
    cleanup(container)
  })

  it('returns undefined when element is not in a tree', () => {
    const el = document.createElement('li')
    el.setAttribute('role', 'treeitem')
    document.body.appendChild(el)
    expect(getVisibleElement(el, 'next')).toBeUndefined()
    document.body.removeChild(el)
  })
})

describe('getNextFocusableElement', () => {
  it('focuses first child on ArrowRight from open node', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" aria-expanded="true" id="parent">
          Parent
          <ul role="group">
            <li role="treeitem" id="child-1">Child 1</li>
            <li role="treeitem" id="child-2">Child 2</li>
          </ul>
        </li>
      </ul>
    `)

    const parent = container.querySelector('#parent') as HTMLElement
    const result = getNextFocusableElement(parent, new KeyboardEvent('keydown', {key: 'ArrowRight'}))
    expect(result?.id).toBe('child-1')
    cleanup(container)
  })

  it('returns undefined on ArrowRight from closed node (node should open)', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" aria-expanded="false" id="closed">
          Closed
          <ul role="group">
            <li role="treeitem" id="child">Child</li>
          </ul>
        </li>
      </ul>
    `)

    const closed = container.querySelector('#closed') as HTMLElement
    const result = getNextFocusableElement(closed, new KeyboardEvent('keydown', {key: 'ArrowRight'}))
    expect(result).toBeUndefined()
    cleanup(container)
  })

  it('returns undefined on ArrowLeft from open node (node should close)', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" aria-expanded="true" id="open">
          Open
          <ul role="group">
            <li role="treeitem" id="child">Child</li>
          </ul>
        </li>
      </ul>
    `)

    const open = container.querySelector('#open') as HTMLElement
    const result = getNextFocusableElement(open, new KeyboardEvent('keydown', {key: 'ArrowLeft'}))
    expect(result).toBeUndefined()
    cleanup(container)
  })

  it('focuses parent on ArrowLeft from closed node', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" aria-expanded="true" id="parent">
          Parent
          <ul role="group">
            <li role="treeitem" aria-expanded="false" id="child">Child</li>
          </ul>
        </li>
      </ul>
    `)

    const child = container.querySelector('#child') as HTMLElement
    const result = getNextFocusableElement(child, new KeyboardEvent('keydown', {key: 'ArrowLeft'}))
    expect(result?.id).toBe('parent')
    cleanup(container)
  })

  it('focuses parent on ArrowLeft from end node', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" aria-expanded="true" id="parent">
          Parent
          <ul role="group">
            <li role="treeitem" id="child">Child</li>
          </ul>
        </li>
      </ul>
    `)

    const child = container.querySelector('#child') as HTMLElement
    const result = getNextFocusableElement(child, new KeyboardEvent('keydown', {key: 'ArrowLeft'}))
    expect(result?.id).toBe('parent')
    cleanup(container)
  })

  it('focuses next visible element on ArrowDown', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" id="item-1">Item 1</li>
        <li role="treeitem" id="item-2">Item 2</li>
      </ul>
    `)

    const item1 = container.querySelector('#item-1') as HTMLElement
    const result = getNextFocusableElement(item1, new KeyboardEvent('keydown', {key: 'ArrowDown'}))
    expect(result?.id).toBe('item-2')
    cleanup(container)
  })

  it('focuses previous visible element on ArrowUp', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" id="item-1">Item 1</li>
        <li role="treeitem" id="item-2">Item 2</li>
      </ul>
    `)

    const item2 = container.querySelector('#item-2') as HTMLElement
    const result = getNextFocusableElement(item2, new KeyboardEvent('keydown', {key: 'ArrowUp'}))
    expect(result?.id).toBe('item-1')
    cleanup(container)
  })

  it('focuses first element on Home', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" id="item-1">Item 1</li>
        <li role="treeitem" id="item-2">Item 2</li>
        <li role="treeitem" id="item-3">Item 3</li>
      </ul>
    `)

    const item3 = container.querySelector('#item-3') as HTMLElement
    const result = getNextFocusableElement(item3, new KeyboardEvent('keydown', {key: 'Home'}))
    expect(result?.id).toBe('item-1')
    cleanup(container)
  })

  it('focuses last element on End', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" id="item-1">Item 1</li>
        <li role="treeitem" id="item-2">Item 2</li>
        <li role="treeitem" id="item-3">Item 3</li>
      </ul>
    `)

    const item1 = container.querySelector('#item-1') as HTMLElement
    const result = getNextFocusableElement(item1, new KeyboardEvent('keydown', {key: 'End'}))
    expect(result?.id).toBe('item-3')
    cleanup(container)
  })

  it('focuses parent on Backspace', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" aria-expanded="true" id="parent">
          Parent
          <ul role="group">
            <li role="treeitem" id="child">Child</li>
          </ul>
        </li>
      </ul>
    `)

    const child = container.querySelector('#child') as HTMLElement
    const result = getNextFocusableElement(child, new KeyboardEvent('keydown', {key: 'Backspace'}))
    expect(result?.id).toBe('parent')
    cleanup(container)
  })

  it('does nothing on ArrowRight from end node', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" id="end-node">End node</li>
      </ul>
    `)

    const endNode = container.querySelector('#end-node') as HTMLElement
    const result = getNextFocusableElement(endNode, new KeyboardEvent('keydown', {key: 'ArrowRight'}))
    expect(result).toBeUndefined()
    cleanup(container)
  })

  it('returns undefined on ArrowDown at the end of the tree', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" id="item-1">Item 1</li>
        <li role="treeitem" id="item-2">Item 2</li>
      </ul>
    `)

    const item2 = container.querySelector('#item-2') as HTMLElement
    const result = getNextFocusableElement(item2, new KeyboardEvent('keydown', {key: 'ArrowDown'}))
    expect(result).toBeUndefined()
    cleanup(container)
  })

  it('navigates into expanded children on ArrowDown', () => {
    const container = createTree(`
      <ul role="tree">
        <li role="treeitem" aria-expanded="true" id="parent">
          Parent
          <ul role="group">
            <li role="treeitem" id="child-1">Child 1</li>
            <li role="treeitem" id="child-2">Child 2</li>
          </ul>
        </li>
        <li role="treeitem" id="sibling">Sibling</li>
      </ul>
    `)

    const parent = container.querySelector('#parent') as HTMLElement
    const result = getNextFocusableElement(parent, new KeyboardEvent('keydown', {key: 'ArrowDown'}))
    expect(result?.id).toBe('child-1')
    cleanup(container)
  })
})

// Test component that uses the useRovingTabIndex hook directly
function TreeWithRovingTabIndex({
  preventScroll = true,
  children,
}: {
  preventScroll?: boolean
  children: React.ReactNode
}) {
  const containerRef = React.useRef<HTMLUListElement>(null)
  const mouseDownRef = React.useRef<boolean>(false)

  useRovingTabIndex({
    containerRef,
    mouseDownRef,
    preventScroll,
  })

  return (
    <ul
      ref={containerRef}
      role="tree"
      aria-label="Test tree"
      onMouseDown={() => {
        mouseDownRef.current = true
      }}
      onMouseUp={() => {
        mouseDownRef.current = false
      }}
    >
      {children}
    </ul>
  )
}

describe('useRovingTabIndex hook', () => {
  afterEach(cleanupRTL)

  it('moves focus with keyboard navigation', () => {
    const {getByRole} = render(
      <TreeWithRovingTabIndex>
        <li role="treeitem" tabIndex={0} id="item-1">
          Item 1
        </li>
        <li role="treeitem" tabIndex={0} id="item-2">
          Item 2
        </li>
        <li role="treeitem" tabIndex={0} id="item-3">
          Item 3
        </li>
      </TreeWithRovingTabIndex>,
    )

    const tree = getByRole('tree')
    const item1 = tree.querySelector('#item-1') as HTMLElement
    const item2 = tree.querySelector('#item-2') as HTMLElement

    act(() => item1.focus())
    expect(item1).toHaveFocus()

    fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})
    expect(item2).toHaveFocus()

    fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowUp'})
    expect(item1).toHaveFocus()
  })

  describe('preventScroll', () => {
    it('defaults to preventScroll=true', () => {
      const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus')

      const {getByRole} = render(
        <TreeWithRovingTabIndex>
          <li role="treeitem" tabIndex={0} id="item-1">
            Item 1
          </li>
          <li role="treeitem" tabIndex={0} id="item-2">
            Item 2
          </li>
        </TreeWithRovingTabIndex>,
      )

      const tree = getByRole('tree')
      const item1 = tree.querySelector('#item-1') as HTMLElement

      act(() => item1.focus())
      focusSpy.mockClear()

      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // When preventScroll is true, the focus zone should call focus with preventScroll: true
      const focusCalls = focusSpy.mock.calls
      const hasPreventScrollCall = focusCalls.some(call => {
        const options = call[0] as FocusOptions | undefined
        return options?.preventScroll === true
      })
      expect(hasPreventScrollCall).toBe(true)

      focusSpy.mockRestore()
    })

    it('allows scrolling when preventScroll is false', () => {
      const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus')

      const {getByRole} = render(
        <TreeWithRovingTabIndex preventScroll={false}>
          <li role="treeitem" tabIndex={0} id="item-1">
            Item 1
          </li>
          <li role="treeitem" tabIndex={0} id="item-2">
            Item 2
          </li>
        </TreeWithRovingTabIndex>,
      )

      const tree = getByRole('tree')
      const item1 = tree.querySelector('#item-1') as HTMLElement

      act(() => item1.focus())
      focusSpy.mockClear()

      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // When preventScroll is false, focus calls should not include preventScroll: true
      const focusCalls = focusSpy.mock.calls
      const hasPreventScrollCall = focusCalls.some(call => {
        const options = call[0] as FocusOptions | undefined
        return options?.preventScroll === true
      })
      expect(hasPreventScrollCall).toBe(false)

      focusSpy.mockRestore()
    })
  })

  describe('mouse click bypass', () => {
    it('does not redirect focus when mouseDownRef is true (click scenario)', () => {
      const {getByRole} = render(
        <TreeWithRovingTabIndex>
          <li role="treeitem" tabIndex={0} id="item-1">
            Item 1
          </li>
          <li role="treeitem" tabIndex={0} id="item-2" aria-current="true">
            Item 2
          </li>
        </TreeWithRovingTabIndex>,
      )

      const tree = getByRole('tree')
      const item1 = tree.querySelector('#item-1') as HTMLElement

      // Simulate a mouse click: mouseDown sets the ref, then focus happens
      fireEvent.mouseDown(tree)
      act(() => item1.focus())

      // Focus should stay on item-1 (not redirected to aria-current item)
      // because mouseDownRef is true during click
      expect(item1).toHaveFocus()
    })
  })
})
