import {describe, expect, it, afterEach, vi} from 'vitest'
import {render, screen, act} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ActionBar from './'
import {BoldIcon, ItalicIcon, CodeIcon} from '@primer/octicons-react'
import {useState} from 'react'

describe('ActionBar', () => {
  afterEach(() => {
    vi.clearAllMocks()
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
          <ActionBar.IconButton icon={BoldIcon} aria-label="Zero width button" />
        </ActionBar>
      </div>,
    )

    // Component should still render even with zero width
    expect(screen.getByRole('button', {name: 'Zero width button'})).toBeInTheDocument()
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
