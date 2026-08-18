import {describe, expect, it, afterEach, vi} from 'vitest'
import {render, screen, act} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type React from 'react'
import {createRef, useState} from 'react'
import ActionBar from './'
import {BoldIcon, ItalicIcon, CodeIcon} from '@primer/octicons-react'
import {implementsClassName} from '../utils/testing'
import classes from './ActionBar.module.css'
import {SelectPanel, type SelectPanelProps} from '../SelectPanel'

type IntersectionEntry = Pick<IntersectionObserverEntry, 'target' | 'isIntersecting' | 'intersectionRatio'>

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  readonly observed = new Set<Element>()
  callback: (entries: IntersectionEntry[]) => void

  constructor(callback: (entries: IntersectionEntry[]) => void) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }

  observe(element: Element) {
    this.observed.add(element)
  }

  unobserve(element: Element) {
    this.observed.delete(element)
  }

  disconnect() {
    this.observed.clear()
  }

  trigger(entries: IntersectionEntry[]) {
    act(() => this.callback(entries))
  }
}

const selectPanelItems: SelectPanelProps['items'] = [{text: 'Alpha'}, {text: 'Beta'}]

function ActionBarSelectPanel({
  disabled = false,
  grouped = false,
  onOpenChange = () => {},
}: {
  disabled?: boolean
  grouped?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<SelectPanelProps['items']>([])
  const [filterValue, setFilterValue] = useState('')

  const panel = (
    <SelectPanel
      title="Projects"
      placeholder="Projects"
      open={open}
      onOpenChange={nextOpen => {
        onOpenChange(nextOpen)
        setOpen(nextOpen)
      }}
      items={selectPanelItems}
      selected={selected}
      onSelectedChange={setSelected}
      filterValue={filterValue}
      onFilterChange={setFilterValue}
      renderAnchor={(anchorProps, activeAnchorRef) => (
        <ActionBar.Button {...anchorProps} activeAnchorRef={activeAnchorRef} disabled={disabled}>
          Projects
        </ActionBar.Button>
      )}
    />
  )

  return <ActionBar aria-label="Toolbar">{grouped ? <ActionBar.Group>{panel}</ActionBar.Group> : panel}</ActionBar>
}

function overflowElement(element: Element, overflowing: boolean) {
  const observer = MockIntersectionObserver.instances.find(instance => instance.observed.has(element))
  if (!observer) throw new Error('Expected element to be observed for overflow')

  observer.trigger([
    {
      target: element,
      isIntersecting: !overflowing,
      intersectionRatio: overflowing ? 0 : 1,
    },
  ])
}

describe('ActionBar', () => {
  implementsClassName(ActionBar, classes.Nav)
  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
    MockIntersectionObserver.instances = []
  })

  it('should not trigger disabled button', () => {
    const onClick = vi.fn()
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Default" onClick={onClick} disabled></ActionBar.IconButton>
      </ActionBar>,
    )

    const button = screen.getByRole('button')
    button.click()

    expect(onClick).not.toHaveBeenCalled()
  })

  it('should trigger non-disabled button', () => {
    const onClick = vi.fn()
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Default" onClick={onClick}></ActionBar.IconButton>
      </ActionBar>,
    )

    const button = screen.getByRole('button')
    button.click()

    expect(onClick).toHaveBeenCalled()
  })

  it('should not trigger disabled button with spacebar or enter', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Default" onClick={onClick} disabled></ActionBar.IconButton>
      </ActionBar>,
    )

    const button = screen.getByRole('button')

    act(() => {
      button.focus()
    })

    await user.keyboard('{Enter}')

    expect(onClick).not.toHaveBeenCalled()
  })

  it('should trigger non-disabled button with spacebar or enter', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Default" onClick={onClick}></ActionBar.IconButton>
      </ActionBar>,
    )

    const button = screen.getByRole('button')

    act(() => {
      button.focus()
    })

    await user.keyboard('{Enter}')

    expect(onClick).toHaveBeenCalled()
  })

  it('updates IconButton activeAnchorRef when the action overflows', () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    const activeAnchorRef = createRef<HTMLButtonElement>()

    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton activeAnchorRef={activeAnchorRef} icon={BoldIcon} aria-label="Bold" />
      </ActionBar>,
    )

    const inlineButton = screen.getByRole('button', {name: 'Bold'})
    expect(activeAnchorRef.current).toBe(inlineButton)

    overflowElement(inlineButton, true)
    expect(activeAnchorRef.current).toBe(screen.getByRole('button', {name: 'More items'}))
  })
})

describe('ActionBar.Button', () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
    MockIntersectionObserver.instances = []
  })

  it('renders a text button with its children as the accessible name', () => {
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.Button>Save</ActionBar.Button>
      </ActionBar>,
    )

    expect(screen.getByRole('button', {name: 'Save'})).toBeInTheDocument()
  })

  it('should trigger non-disabled button', () => {
    const onClick = vi.fn()
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.Button onClick={onClick}>Save</ActionBar.Button>
      </ActionBar>,
    )

    screen.getByRole('button', {name: 'Save'}).click()

    expect(onClick).toHaveBeenCalled()
  })

  it('should not trigger disabled button', () => {
    const onClick = vi.fn()
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.Button onClick={onClick} disabled>
          Save
        </ActionBar.Button>
      </ActionBar>,
    )

    screen.getByRole('button', {name: 'Save'}).click()

    expect(onClick).not.toHaveBeenCalled()
  })

  it('should not trigger disabled button with spacebar or enter', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.Button onClick={onClick} disabled>
          Save
        </ActionBar.Button>
      </ActionBar>,
    )

    const button = screen.getByRole('button', {name: 'Save'})

    act(() => {
      button.focus()
    })

    await user.keyboard('{Enter}')

    expect(onClick).not.toHaveBeenCalled()
  })

  it('updates activeAnchorRef when the button moves into and out of overflow', () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

    const activeAnchorRef = createRef<HTMLButtonElement>()
    const forwardedRef = createRef<HTMLButtonElement>()
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.Button ref={forwardedRef} activeAnchorRef={activeAnchorRef}>
          Save
        </ActionBar.Button>
      </ActionBar>,
    )

    const inlineButton = screen.getByRole('button', {name: 'Save'})
    expect(forwardedRef.current).toBe(inlineButton)
    expect(activeAnchorRef.current).toBe(inlineButton)

    const observer = MockIntersectionObserver.instances.at(-1)!
    observer.trigger([{target: inlineButton, isIntersecting: false, intersectionRatio: 0}])

    expect(activeAnchorRef.current).toBe(screen.getByRole('button', {name: 'More items'}))
    expect(forwardedRef.current).toBe(inlineButton)

    observer.trigger([{target: inlineButton, isIntersecting: true, intersectionRatio: 1}])
    expect(activeAnchorRef.current).toBe(inlineButton)
  })

  it('clears callback activeAnchorRef when the button unmounts', async () => {
    const user = userEvent.setup()
    const activeAnchors: Array<HTMLButtonElement | null> = []
    const activeAnchorRef = (anchor: HTMLButtonElement | null) => {
      activeAnchors.push(anchor)
    }

    const Test = () => {
      const [visible, setVisible] = useState(true)
      return (
        <>
          <ActionBar aria-label="Toolbar">
            {visible ? <ActionBar.Button activeAnchorRef={activeAnchorRef}>Save</ActionBar.Button> : null}
          </ActionBar>
          <button type="button" onClick={() => setVisible(false)}>
            Unmount action
          </button>
        </>
      )
    }

    render(<Test />)
    await user.click(screen.getByRole('button', {name: 'Unmount action'}))

    expect(activeAnchors.at(-1)).toBeNull()
  })

  it.each([
    ['pointer', async (user: ReturnType<typeof userEvent.setup>, item: HTMLElement) => user.click(item)],
    [
      'Enter',
      async (user: ReturnType<typeof userEvent.setup>, item: HTMLElement) => {
        item.focus()
        await user.keyboard('{Enter}')
      },
    ],
    [
      'Space',
      async (user: ReturnType<typeof userEvent.setup>, item: HTMLElement) => {
        item.focus()
        await user.keyboard(' ')
      },
    ],
  ])('opens a SelectPanel once from overflow with %s activation', async (_name, activate) => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<ActionBarSelectPanel onOpenChange={onOpenChange} />)

    const inlineButton = screen.getByRole('button', {name: 'Projects'})
    overflowElement(inlineButton, true)
    await user.click(screen.getByRole('button', {name: 'More items'}))
    await activate(user, screen.getByRole('menuitem', {name: 'Projects'}))

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('dialog', {name: 'Projects'})).toBeInTheDocument()
    expect(onOpenChange).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('returns focus to the overflow button when the SelectPanel closes', async () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    const user = userEvent.setup()
    render(<ActionBarSelectPanel />)

    const inlineButton = screen.getByRole('button', {name: 'Projects'})
    overflowElement(inlineButton, true)
    const overflowButton = screen.getByRole('button', {name: 'More items'})
    await user.click(overflowButton)
    await user.click(screen.getByRole('menuitem', {name: 'Projects'}))
    await user.keyboard('{Escape}')

    expect(overflowButton).toHaveFocus()
  })

  it('returns focus to the inline button when it becomes visible while the SelectPanel is open', async () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    const user = userEvent.setup()
    render(<ActionBarSelectPanel />)

    const inlineButton = screen.getByRole('button', {name: 'Projects'})
    overflowElement(inlineButton, true)
    await user.click(screen.getByRole('button', {name: 'More items'}))
    await user.click(screen.getByRole('menuitem', {name: 'Projects'}))
    overflowElement(inlineButton, false)
    await user.keyboard('{Escape}')

    expect(inlineButton).toHaveFocus()
  })

  it('returns focus to the overflow button when the action overflows while the SelectPanel is open', async () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    const user = userEvent.setup()
    render(<ActionBarSelectPanel />)

    const inlineButton = screen.getByRole('button', {name: 'Projects'})
    await user.click(inlineButton)
    overflowElement(inlineButton, true)
    const overflowButton = screen.getByRole('button', {name: 'More items'})
    await user.keyboard('{Escape}')

    expect(overflowButton).toHaveFocus()
  })

  it('uses the overflow button as the active anchor when a group overflows', async () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    const user = userEvent.setup()
    const {container} = render(<ActionBarSelectPanel grouped />)

    const group = container.querySelector('[data-component="ActionBar.Group"]')
    if (!group) throw new Error('Expected ActionBar group')
    overflowElement(group, true)

    const overflowButton = screen.getByRole('button', {name: 'More items'})
    await user.click(overflowButton)
    await user.click(screen.getByRole('menuitem', {name: 'Projects'}))
    await user.keyboard('{Escape}')

    expect(overflowButton).toHaveFocus()
  })

  it('does not activate a disabled action from overflow', async () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<ActionBarSelectPanel disabled onOpenChange={onOpenChange} />)

    const inlineButton = screen.getByRole('button', {name: 'Projects'})
    overflowElement(inlineButton, true)
    await user.click(screen.getByRole('button', {name: 'More items'}))
    await user.click(screen.getByRole('menuitem', {name: 'Projects'}))

    expect(onOpenChange).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog', {name: 'Projects'})).not.toBeInTheDocument()
  })
})

describe('ActionBar Registry System', () => {
  it('should preserve order with deep nesting', () => {
    render(
      <ActionBar aria-label="Deep test">
        <div>
          <ActionBar.IconButton icon={BoldIcon} aria-label="First" />
        </div>
        <ActionBar.IconButton icon={ItalicIcon} aria-label="Second" />
        <div>
          <ActionBar.IconButton icon={CodeIcon} aria-label="Third" />
        </div>
      </ActionBar>,
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
    expect(buttons[0]).toHaveAccessibleName('First')
    expect(buttons[1]).toHaveAccessibleName('Second')
    expect(buttons[2]).toHaveAccessibleName('Third')
  })

  it('should preserve group order with deep nesting', () => {
    render(
      <ActionBar aria-label="Deep test">
        <div>
          <ActionBar.Group>
            <ActionBar.IconButton icon={BoldIcon} aria-label="First" />
          </ActionBar.Group>
        </div>
        <ActionBar.Group>
          <ActionBar.IconButton icon={ItalicIcon} aria-label="Second" />
        </ActionBar.Group>
        <div>
          <ActionBar.Group>
            <ActionBar.IconButton icon={CodeIcon} aria-label="Third" />
          </ActionBar.Group>
        </div>
      </ActionBar>,
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
    expect(buttons[0]).toHaveAccessibleName('First')
    expect(buttons[1]).toHaveAccessibleName('Second')
    expect(buttons[2]).toHaveAccessibleName('Third')
  })

  it('should handle conditional rendering without breaking order', async () => {
    const ConditionalTest = () => {
      const [show, setShow] = useState([true, true, true])

      return (
        <div>
          <ActionBar aria-label="Conditional">
            {show[0] && <ActionBar.IconButton icon={BoldIcon} aria-label="First" />}
            <ActionBar.Group>
              {show[1] && <ActionBar.IconButton icon={ItalicIcon} aria-label="Second" />}
            </ActionBar.Group>
            {show[2] && <ActionBar.IconButton icon={CodeIcon} aria-label="Third" />}
          </ActionBar>
          <button type="button" onClick={() => setShow([false, true, true])}>
            Hide first
          </button>
          <button type="button" onClick={() => setShow([true, true, true])}>
            Show all
          </button>
        </div>
      )
    }

    const user = userEvent.setup()
    render(<ConditionalTest />)

    // Initially should have 3 buttons
    expect(screen.getAllByRole('button', {name: /First|Second|Third/})).toHaveLength(3)

    // Hide first button
    await user.click(screen.getByText('Hide first'))

    const buttonsAfterHide = screen.getAllByRole('button', {name: /Second|Third/})
    expect(buttonsAfterHide).toHaveLength(2)
    expect(buttonsAfterHide[0]).toHaveAccessibleName('Second')
    expect(buttonsAfterHide[1]).toHaveAccessibleName('Third')

    // Show first button again
    await user.click(screen.getByText('Show all'))

    const buttonsAfterShow = screen.getAllByRole('button', {name: /First|Second|Third/})
    expect(buttonsAfterShow).toHaveLength(3)
    expect(buttonsAfterShow[0]).toHaveAccessibleName('First')
    expect(buttonsAfterShow[1]).toHaveAccessibleName('Second')
    expect(buttonsAfterShow[2]).toHaveAccessibleName('Third')
  })

  it('should handle fragments and array mapping', () => {
    render(
      <ActionBar aria-label="Fragment test">
        <>
          <ActionBar.IconButton icon={BoldIcon} aria-label="In fragment" />
          {[1, 2].map(i => (
            <ActionBar.IconButton key={i} icon={ItalicIcon} aria-label={`Mapped ${i}`} />
          ))}
        </>
        <ActionBar.IconButton icon={CodeIcon} aria-label="After fragment" />
      </ActionBar>,
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(4)
    expect(buttons[0]).toHaveAccessibleName('In fragment')
    expect(buttons[1]).toHaveAccessibleName('Mapped 1')
    expect(buttons[2]).toHaveAccessibleName('Mapped 2')
    expect(buttons[3]).toHaveAccessibleName('After fragment')
  })

  it('should handle rapid re-renders without losing registry data', async () => {
    const RapidRerenderTest = () => {
      const [count, setCount] = useState(0)

      return (
        <div>
          <ActionBar aria-label="Rapid rerender">
            <ActionBar.IconButton icon={BoldIcon} aria-label={`Button ${count}`} />
          </ActionBar>
          <button type="button" onClick={() => setCount(c => c + 1)}>
            Increment
          </button>
        </div>
      )
    }

    const user = userEvent.setup()
    render(<RapidRerenderTest />)

    // Rapidly trigger re-renders
    for (let i = 0; i < 10; i++) {
      await user.click(screen.getByText('Increment'))
    }

    expect(screen.getByRole('button', {name: 'Button 10'})).toBeInTheDocument()
  })

  it('should handle zero-width scenarios gracefully', () => {
    render(
      <div style={{width: 0, overflow: 'hidden'}}>
        <ActionBar aria-label="Zero width">
          <ActionBar.IconButton icon={BoldIcon} aria-label="Zero width button" data-testid="zero-width-button" />
        </ActionBar>
      </div>,
    )

    // Component should still render even with zero width
    // Button is unlabeled because the label is hidden, so we select by test id instead
    expect(screen.getByTestId('zero-width-button')).toBeInTheDocument()
  })

  it('should clean up registry on unmount', async () => {
    const UnmountTest = () => {
      const [mounted, setMounted] = useState(true)

      return (
        <div>
          {mounted && (
            <ActionBar aria-label="Unmount test">
              <ActionBar.IconButton icon={BoldIcon} aria-label="Will unmount" />
            </ActionBar>
          )}
          <button type="button" onClick={() => setMounted(false)}>
            Unmount
          </button>
        </div>
      )
    }

    const user = userEvent.setup()
    render(<UnmountTest />)

    expect(screen.getByRole('button', {name: 'Will unmount'})).toBeInTheDocument()

    await user.click(screen.getByText('Unmount'))

    expect(screen.queryByRole('button', {name: 'Will unmount'})).not.toBeInTheDocument()
  })
})

describe('ActionBar gap prop', () => {
  it('defaults to condensed', () => {
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Bold" />
        <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic" />
      </ActionBar>,
    )
    const toolbar = screen.getByRole('toolbar')
    expect(toolbar).toHaveAttribute('data-gap', 'condensed')
  })

  it('applies provided gap scale (none)', () => {
    render(
      <ActionBar aria-label="Toolbar" gap="none">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Bold" />
        <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic" />
      </ActionBar>,
    )
    const toolbar = screen.getByRole('toolbar')
    expect(toolbar).toHaveAttribute('data-gap', 'none')
  })

  it('applies provided gap scale (condensed)', () => {
    render(
      <ActionBar aria-label="Toolbar" gap="condensed">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Bold" />
        <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic" />
      </ActionBar>,
    )
    const toolbar = screen.getByRole('toolbar')
    expect(toolbar).toHaveAttribute('data-gap', 'condensed')
  })
})

describe('ActionBar.Menu returnFocusRef', () => {
  it('accepts returnFocusRef prop', () => {
    const returnFocusRef = createRef<HTMLButtonElement>()
    render(
      <div>
        <button ref={returnFocusRef} type="button">
          Return focus target
        </button>
        <ActionBar aria-label="Toolbar">
          <ActionBar.Menu
            aria-label="More options"
            icon={BoldIcon}
            returnFocusRef={returnFocusRef}
            items={[{label: 'Option 1', onClick: vi.fn()}]}
          />
        </ActionBar>
      </div>,
    )

    expect(screen.getByRole('button', {name: 'More options'})).toBeInTheDocument()
  })

  it('returns focus to returnFocusRef when menu is closed', async () => {
    const user = userEvent.setup()
    const returnFocusRef = createRef<HTMLButtonElement>()

    render(
      <div>
        <button ref={returnFocusRef} data-testid="return-focus-target" type="button">
          Return focus target
        </button>
        <ActionBar aria-label="Toolbar">
          <ActionBar.Menu
            aria-label="More options"
            icon={BoldIcon}
            returnFocusRef={returnFocusRef}
            items={[{label: 'Option 1', onClick: vi.fn()}]}
          />
        </ActionBar>
      </div>,
    )

    const menuButton = screen.getByRole('button', {name: 'More options'})

    // Open the menu
    await user.click(menuButton)

    // Verify menu is open
    expect(screen.getByRole('menu')).toBeInTheDocument()

    // Close the menu by pressing Escape
    await user.keyboard('{Escape}')

    // Verify focus is returned to the returnFocusRef element
    const returnFocusTarget = screen.getByTestId('return-focus-target')
    expect(document.activeElement).toEqual(returnFocusTarget)
  })

  it('returns focus to returnFocusRef when menu item is selected', async () => {
    const user = userEvent.setup()
    const returnFocusRef = createRef<HTMLButtonElement>()
    const onClick = vi.fn()

    render(
      <div>
        <button ref={returnFocusRef} data-testid="return-focus-target" type="button">
          Return focus target
        </button>
        <ActionBar aria-label="Toolbar">
          <ActionBar.Menu
            aria-label="More options"
            icon={BoldIcon}
            returnFocusRef={returnFocusRef}
            items={[{label: 'Option 1', onClick}]}
          />
        </ActionBar>
      </div>,
    )

    const menuButton = screen.getByRole('button', {name: 'More options'})

    // Open the menu
    await user.click(menuButton)

    // Click a menu item
    await user.click(screen.getByRole('menuitem', {name: 'Option 1'}))

    // Verify focus is returned to the returnFocusRef element
    const returnFocusTarget = screen.getByTestId('return-focus-target')
    expect(document.activeElement).toEqual(returnFocusTarget)
  })

  it('returns focus to anchor button when returnFocusRef is not provided', async () => {
    const user = userEvent.setup()

    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.Menu aria-label="More options" icon={BoldIcon} items={[{label: 'Option 1', onClick: vi.fn()}]} />
      </ActionBar>,
    )

    const menuButton = screen.getByRole('button', {name: 'More options'})

    // Open the menu
    await user.click(menuButton)

    // Verify menu is open
    expect(screen.getByRole('menu')).toBeInTheDocument()

    // Close the menu by pressing Escape
    await user.keyboard('{Escape}')

    // Verify focus returns to the menu button (default behavior)
    expect(document.activeElement).toEqual(menuButton)
  })
})

describe('ActionBar data-component attributes', () => {
  it('renders ActionBar with data-component attribute', () => {
    const {container} = render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Bold" />
      </ActionBar>,
    )

    const actionBar = container.querySelector('[data-component="ActionBar"]')
    expect(actionBar).toBeInTheDocument()
  })

  it('renders ActionBar.IconButton with data-component attribute', () => {
    const {container} = render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Bold" />
      </ActionBar>,
    )

    const iconButton = container.querySelector('[data-component="ActionBar"] [data-component="IconButton"]')
    expect(iconButton).toBeInTheDocument()
  })

  it('renders ActionBar.Button with a text label', () => {
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.Button>Save</ActionBar.Button>
      </ActionBar>,
    )

    const button = screen.getByRole('button', {name: 'Save'})
    expect(button).toBeInTheDocument()
  })

  it('renders ActionBar.VerticalDivider with data-component attribute', () => {
    const {container} = render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Bold" />
        <ActionBar.Divider />
        <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic" />
      </ActionBar>,
    )

    const divider = container.querySelector('[data-component="ActionBar.VerticalDivider"]')
    expect(divider).toBeInTheDocument()
  })

  it('renders ActionBar.Group with data-component attribute', () => {
    const {container} = render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.Group>
          <ActionBar.IconButton icon={BoldIcon} aria-label="Bold" />
          <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic" />
        </ActionBar.Group>
      </ActionBar>,
    )

    const group = container.querySelector('[data-component="ActionBar.Group"]')
    expect(group).toBeInTheDocument()
  })

  it('renders ActionBar.Menu.IconButton with data-component attribute', () => {
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.Menu aria-label="More options" icon={BoldIcon} items={[{label: 'Option 1', onClick: vi.fn()}]} />
      </ActionBar>,
    )

    const menuButton = screen.getByRole('button', {name: 'More options'})
    expect(menuButton).toHaveAttribute('data-component', 'ActionBar.Menu.IconButton')
  })
})
