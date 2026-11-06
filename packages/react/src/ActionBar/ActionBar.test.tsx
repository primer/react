import {page, userEvent} from 'vitest/browser'
import {describe, expect, it, afterEach, vi} from 'vitest'
import {render, act, fireEvent} from '@testing-library/react'
import React, {createRef, useState} from 'react'
import ActionBar from './'
import {BoldIcon, ItalicIcon, CodeIcon} from '@primer/octicons-react'
import {implementsClassName} from '../utils/testing'
import classes from './ActionBar.module.css'

describe('ActionBar', () => {
  implementsClassName(ActionBar, classes.Nav)
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders icon elements in the overflow menu', async () => {
    render(
      <div style={{width: '100px'}}>
        <ActionBar aria-label="Toolbar">
          <ActionBar.IconButton icon={<BoldIcon data-testid="action-icon" />} aria-label="Bold" />
          <ActionBar.Menu
            icon={<ItalicIcon />}
            overflowIcon={<CodeIcon data-testid="menu-icon" />}
            aria-label="Formatting"
            items={[{label: 'Code'}]}
          />
        </ActionBar>
      </div>,
    )

    await expect.element(page.getByRole('toolbar')).toHaveAttribute('data-has-overflow', 'true')
    await userEvent.click(page.getByRole('button', {name: 'More items', exact: true}))

    await expect
      .element(page.getByRole('menuitem', {name: 'Bold', exact: true}).getByTestId('action-icon'))
      .toBeInTheDocument()
    await expect
      .element(page.getByRole('menuitem', {name: 'Formatting', exact: true}).getByTestId('menu-icon'))
      .toBeInTheDocument()
  })

  it('renders icon elements in menu items and submenu triggers', async () => {
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.Menu
          icon={<BoldIcon />}
          aria-label="Formatting"
          items={[
            {
              label: 'Bold',
              leadingVisual: <BoldIcon data-testid="item-leading-icon" />,
              trailingVisual: <ItalicIcon data-testid="item-trailing-icon" />,
            },
            {
              label: 'More formatting',
              leadingVisual: <BoldIcon data-testid="submenu-leading-icon" />,
              trailingVisual: <ItalicIcon data-testid="submenu-trailing-icon" />,
              items: [{label: 'Code'}],
            },
          ]}
        />
      </ActionBar>,
    )

    await userEvent.click(page.getByRole('button', {name: 'Formatting', exact: true}))

    const item = page.getByRole('menuitem', {name: 'Bold', exact: true})
    await expect.element(item.getByTestId('item-leading-icon')).toBeInTheDocument()
    await expect.element(item.getByTestId('item-trailing-icon')).toBeInTheDocument()
    const submenu = page.getByRole('menuitem', {name: 'More formatting', exact: true})
    await expect.element(submenu.getByTestId('submenu-leading-icon')).toBeInTheDocument()
    await expect.element(submenu.getByTestId('submenu-trailing-icon')).toBeInTheDocument()
  })

  it('should not trigger disabled button', () => {
    const onClick = vi.fn()
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Default" onClick={onClick} disabled></ActionBar.IconButton>
      </ActionBar>,
    )

    const button = page.getByRole('button')
    fireEvent.click(button.element())

    expect(onClick).not.toHaveBeenCalled()
  })

  it('should trigger non-disabled button', async () => {
    const onClick = vi.fn()
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Default" onClick={onClick}></ActionBar.IconButton>
      </ActionBar>,
    )

    const button = page.getByRole('button')
    await userEvent.click(button)

    expect(onClick).toHaveBeenCalled()
  })

  it('should not trigger disabled button with spacebar or enter', async () => {
    const onClick = vi.fn()
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Default" onClick={onClick} disabled></ActionBar.IconButton>
      </ActionBar>,
    )

    const button = page.getByRole('button')

    act(() => {
      button.element().focus()
    })

    await userEvent.keyboard('{Enter}')

    expect(onClick).not.toHaveBeenCalled()
  })

  it('should trigger non-disabled button with spacebar or enter', async () => {
    const onClick = vi.fn()
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Default" onClick={onClick}></ActionBar.IconButton>
      </ActionBar>,
    )

    const button = page.getByRole('button')

    act(() => {
      button.element().focus()
    })

    await userEvent.keyboard('{Enter}')

    expect(onClick).toHaveBeenCalled()
  })
})

describe('ActionBar.Button', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders a text button with its children as the accessible name', async () => {
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.Button>Save</ActionBar.Button>
      </ActionBar>,
    )

    await expect.element(page.getByRole('button', {name: 'Save', exact: true})).toBeInTheDocument()
  })

  it('should trigger non-disabled button', async () => {
    const onClick = vi.fn()
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.Button onClick={onClick}>Save</ActionBar.Button>
      </ActionBar>,
    )

    await userEvent.click(page.getByRole('button', {name: 'Save', exact: true}))

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

    fireEvent.click(page.getByRole('button', {name: 'Save', exact: true}).element())

    expect(onClick).not.toHaveBeenCalled()
  })

  it('should not trigger disabled button with spacebar or enter', async () => {
    const onClick = vi.fn()
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.Button onClick={onClick} disabled>
          Save
        </ActionBar.Button>
      </ActionBar>,
    )

    const button = page.getByRole('button', {name: 'Save', exact: true})

    act(() => {
      button.element().focus()
    })

    await userEvent.keyboard('{Enter}')

    expect(onClick).not.toHaveBeenCalled()
  })
})

describe('ActionBar Registry System', () => {
  it('should preserve order with deep nesting', async () => {
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

    const buttons = page.getByRole('button').all()
    expect(buttons).toHaveLength(3)
    await expect.element(buttons[0]).toHaveAccessibleName('First')
    await expect.element(buttons[1]).toHaveAccessibleName('Second')
    await expect.element(buttons[2]).toHaveAccessibleName('Third')
  })

  it('should preserve group order with deep nesting', async () => {
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

    const buttons = page.getByRole('button').all()
    expect(buttons).toHaveLength(3)
    await expect.element(buttons[0]).toHaveAccessibleName('First')
    await expect.element(buttons[1]).toHaveAccessibleName('Second')
    await expect.element(buttons[2]).toHaveAccessibleName('Third')
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

    render(<ConditionalTest />)

    // Initially should have 3 buttons
    expect(page.getByRole('button', {name: /First|Second|Third/}).all()).toHaveLength(3)

    // Hide first button
    await userEvent.click(page.getByText('Hide first', {exact: true}))

    const buttonsAfterHide = page.getByRole('button', {name: /Second|Third/}).all()
    expect(buttonsAfterHide).toHaveLength(2)
    await expect.element(buttonsAfterHide[0]).toHaveAccessibleName('Second')
    await expect.element(buttonsAfterHide[1]).toHaveAccessibleName('Third')

    // Show first button again
    await userEvent.click(page.getByText('Show all', {exact: true}))

    const buttonsAfterShow = page.getByRole('button', {name: /First|Second|Third/}).all()
    expect(buttonsAfterShow).toHaveLength(3)
    await expect.element(buttonsAfterShow[0]).toHaveAccessibleName('First')
    await expect.element(buttonsAfterShow[1]).toHaveAccessibleName('Second')
    await expect.element(buttonsAfterShow[2]).toHaveAccessibleName('Third')
  })

  it('should handle fragments and array mapping', async () => {
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

    const buttons = page.getByRole('button').all()
    expect(buttons).toHaveLength(4)
    await expect.element(buttons[0]).toHaveAccessibleName('In fragment')
    await expect.element(buttons[1]).toHaveAccessibleName('Mapped 1')
    await expect.element(buttons[2]).toHaveAccessibleName('Mapped 2')
    await expect.element(buttons[3]).toHaveAccessibleName('After fragment')
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

    render(<RapidRerenderTest />)

    // Rapidly trigger re-renders
    for (let i = 0; i < 10; i++) {
      await userEvent.click(page.getByText('Increment', {exact: true}))
    }

    await expect.element(page.getByRole('button', {name: 'Button 10', exact: true})).toBeInTheDocument()
  })

  it('should handle zero-width scenarios gracefully', async () => {
    render(
      <div style={{width: 0, overflow: 'hidden'}}>
        <ActionBar aria-label="Zero width">
          <ActionBar.IconButton icon={BoldIcon} aria-label="Zero width button" data-testid="zero-width-button" />
        </ActionBar>
      </div>,
    )

    // Component should still render even with zero width
    // Button is unlabeled because the label is hidden, so we select by test id instead
    await expect.element(page.getByTestId('zero-width-button')).toBeInTheDocument()
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

    render(<UnmountTest />)

    await expect.element(page.getByRole('button', {name: 'Will unmount', exact: true})).toBeInTheDocument()

    await userEvent.click(page.getByText('Unmount', {exact: true}))

    await expect.element(page.getByRole('button', {name: 'Will unmount', exact: true})).not.toBeInTheDocument()
  })
})

describe('ActionBar gap prop', () => {
  it('defaults to condensed', async () => {
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Bold" />
        <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic" />
      </ActionBar>,
    )
    const toolbar = page.getByRole('toolbar')
    await expect.element(toolbar).toHaveAttribute('data-gap', 'condensed')
  })

  it('applies provided gap scale (none)', async () => {
    render(
      <ActionBar aria-label="Toolbar" gap="none">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Bold" />
        <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic" />
      </ActionBar>,
    )
    const toolbar = page.getByRole('toolbar')
    await expect.element(toolbar).toHaveAttribute('data-gap', 'none')
  })

  it('applies provided gap scale (condensed)', async () => {
    render(
      <ActionBar aria-label="Toolbar" gap="condensed">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Bold" />
        <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic" />
      </ActionBar>,
    )
    const toolbar = page.getByRole('toolbar')
    await expect.element(toolbar).toHaveAttribute('data-gap', 'condensed')
  })
})

describe('ActionBar.Menu returnFocusRef', () => {
  it('accepts returnFocusRef prop', async () => {
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

    await expect.element(page.getByRole('button', {name: 'More options', exact: true})).toBeInTheDocument()
  })

  it('returns focus to returnFocusRef when menu is closed', async () => {
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

    const menuButton = page.getByRole('button', {name: 'More options', exact: true})

    // Open the menu
    await userEvent.click(menuButton)

    // Verify menu is open
    await expect.element(page.getByRole('menu')).toBeInTheDocument()

    // Close the menu by pressing Escape
    await userEvent.keyboard('{Escape}')

    // Verify focus is returned to the returnFocusRef element
    const returnFocusTarget = page.getByTestId('return-focus-target')
    await expect.element(returnFocusTarget).toHaveFocus()
  })

  it('returns focus to returnFocusRef when menu item is selected', async () => {
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

    const menuButton = page.getByRole('button', {name: 'More options', exact: true})

    // Open the menu
    await userEvent.click(menuButton)

    // Click a menu item
    await userEvent.click(page.getByRole('menuitem', {name: 'Option 1', exact: true}))

    // Verify focus is returned to the returnFocusRef element
    const returnFocusTarget = page.getByTestId('return-focus-target')
    await expect.element(returnFocusTarget).toHaveFocus()
  })

  it('returns focus to anchor button when returnFocusRef is not provided', async () => {
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.Menu aria-label="More options" icon={BoldIcon} items={[{label: 'Option 1', onClick: vi.fn()}]} />
      </ActionBar>,
    )

    const menuButton = page.getByRole('button', {name: 'More options', exact: true})

    // Open the menu
    await userEvent.click(menuButton)

    // Verify menu is open
    await expect.element(page.getByRole('menu')).toBeInTheDocument()

    // Close the menu by pressing Escape
    await userEvent.keyboard('{Escape}')

    // Verify focus returns to the menu button (default behavior)
    await expect.element(menuButton).toHaveFocus()
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

  it('renders ActionBar.Button with a text label', async () => {
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.Button>Save</ActionBar.Button>
      </ActionBar>,
    )

    const button = page.getByRole('button', {name: 'Save', exact: true})
    await expect.element(button).toBeInTheDocument()
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

  it('renders ActionBar.Menu.IconButton with data-component attribute', async () => {
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.Menu aria-label="More options" icon={BoldIcon} items={[{label: 'Option 1', onClick: vi.fn()}]} />
      </ActionBar>,
    )

    const menuButton = page.getByRole('button', {name: 'More options', exact: true})
    await expect.element(menuButton).toHaveAttribute('data-component', 'ActionBar.Menu.IconButton')
  })
})
