import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'

import {KeybindingHint, getAccessibleKeybindingHintString} from '../KeybindingHint'

describe('KeybindingHint', () => {
  it('renders condensed keys by default', () => {
    render(<KeybindingHint keys="Shift+Control+Function+PageUp" />)
    for (const icon of ['⇧', '⌃', 'Fn', 'PgUp']) {
      const el = screen.getByText(icon)
      expect(el).toBeVisible()
      expect(el).toHaveAttribute('aria-hidden')
    }
  })

  it('renders accessible key descriptions', () => {
    render(<KeybindingHint format="condensed" keys="Control+Shift+{" />)
    for (const name of ['control', 'shift', 'left curly brace']) {
      const el = screen.getByText(name)
      expect(el).toBeInTheDocument()
      expect(el).not.toHaveAttribute('aria-hidden')
    }
  })

  it('renders key names in full format', () => {
    render(<KeybindingHint format="full" keys="Shift+Control+Function+ArrowUp" />)
    for (const name of ['Shift', 'Control', 'Function', 'Up Arrow']) {
      const el = screen.getByText(name)
      expect(el).toBeVisible()
      expect(el).toHaveAttribute('aria-hidden')
    }
  })

  it('sorts modifier keys', () => {
    render(<KeybindingHint format="full" keys="Shift+Control+PageUp+Function" />)
    const namesInOrder = ['Control', 'Shift', 'Function', 'Page Up']
    const names = screen.getAllByText(text => namesInOrder.includes(text)).map(el => el.textContent)
    expect(names).toEqual(namesInOrder)
  })

  it('capitalizes other keys', () => {
    render(<KeybindingHint format="condensed" keys="control+a" />)
    for (const key of ['⌃', 'A']) expect(screen.getByText(key)).toBeInTheDocument()
  })

  it.each([
    ['Plus', '+'],
    ['Space', '␣'],
  ])('renders %s as symbol in condensed mode', (name, symbol) => {
    render(<KeybindingHint format="condensed" keys={name} />)
    expect(screen.getByText(symbol)).toBeInTheDocument()
  })

  it.each(['Plus', 'Space'])('renders %s as name in full format', name => {
    render(<KeybindingHint format="full" keys={name} />)
    expect(screen.getByText(name)).toBeInTheDocument()
  })

  it('does not render plus signs in condensed mode', () => {
    render(<KeybindingHint format="condensed" keys="control+b" />)
    expect(screen.queryByText('+')).not.toBeInTheDocument()
  })

  it('renders plus signs between keys in full format', () => {
    render(<KeybindingHint format="full" keys="control+b" />)
    const plus = screen.getByText('+')
    expect(plus).toBeVisible()
    expect(plus).toHaveAttribute('aria-hidden')
  })

  it('renders sequences separated by hidden "then"', () => {
    render(<KeybindingHint keys="Mod+A F" format="full" />)
    const el = screen.getByText('then')
    expect(el).toBeInTheDocument()
    expect(el).not.toHaveAttribute('aria-hidden')
  })

  it('accepts className prop', () => {
    render(<KeybindingHint keys="Control" className="test-class" />)
    expect(screen.getByTestId('keybinding-hint')).toHaveClass('test-class')
  })
})

describe('getAccessibleKeybindingHintString', () => {
  it('returns full readable key names', () =>
    expect(getAccessibleKeybindingHintString('{', false)).toBe('left curly brace'))

  it('joins keys in a chord with space', () =>
    expect(getAccessibleKeybindingHintString('Command+U', false)).toBe('command u'))

  it('sorts modifiers in standard order', () =>
    expect(getAccessibleKeybindingHintString('Alt+Shift+Command+%', false)).toBe('alt shift command percent'))

  it('joins chords in a sequence with "then"', () =>
    expect(getAccessibleKeybindingHintString('Alt+9 x y', false)).toBe('alt 9 then x then y'))

  it('returns "command" for "mod" on MacOS', () =>
    expect(getAccessibleKeybindingHintString('Mod+x', true)).toBe('command x'))

  it('returns "control" for "mod" on non-MacOS', () =>
    expect(getAccessibleKeybindingHintString('Mod+x', false)).toBe('control x'))
})
