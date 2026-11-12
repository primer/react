import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {page} from 'vitest/browser'

import {KeybindingHint, getAccessibleKeybindingHintString} from '../KeybindingHint'
import {implementsClassName} from '../utils/testing'

describe('KeybindingHint', () => {
  implementsClassName(props => <KeybindingHint keys="Control" {...props} />)

  it('renders data-component="KeybindingHint" on the root element', async () => {
    render(<KeybindingHint keys="Control" />)
    await expect.element(page.getByTestId('keybinding-hint')).toHaveAttribute('data-component', 'KeybindingHint')
  })

  it('renders condensed keys by default', async () => {
    render(<KeybindingHint keys="Shift+Control+Function+PageUp" />)
    for (const icon of ['⇧', '⌃', 'Fn', 'PgUp']) {
      const el = page.getByText(icon, {exact: true})
      await expect.element(el).toBeVisible()
      await expect.element(el).toHaveAttribute('aria-hidden')
    }
  })

  it('renders accessible key descriptions', async () => {
    render(<KeybindingHint format="condensed" keys="Control+Shift+{" />)
    for (const name of ['control', 'shift', 'left curly brace']) {
      const el = page.getByText(name, {exact: true})
      await expect.element(el).toBeInTheDocument()
      await expect.element(el).not.toHaveAttribute('aria-hidden')
    }
  })

  it('renders key names in full format', async () => {
    render(<KeybindingHint format="full" keys="Shift+Control+Function+ArrowUp" />)
    for (const name of ['Shift', 'Control', 'Function', 'Up Arrow']) {
      const el = page.getByText(name, {exact: true})
      await expect.element(el).toBeVisible()
      await expect.element(el).toHaveAttribute('aria-hidden')
    }
  })

  it('sorts modifier keys', () => {
    render(<KeybindingHint format="full" keys="Shift+Control+PageUp+Function" />)
    const namesInOrder = ['Control', 'Shift', 'Function', 'Page Up']
    const names = page
      .getByText(/^(Control|Shift|Function|Page Up)$/)
      .elements()
      .map(el => el.textContent)
    expect(names).toEqual(namesInOrder)
  })

  it('capitalizes other keys', async () => {
    render(<KeybindingHint format="condensed" keys="control+a" />)
    for (const key of ['⌃', 'A']) await expect.element(page.getByText(key, {exact: true})).toBeInTheDocument()
  })

  it.each([
    ['Plus', '+'],
    ['Space', '␣'],
  ])('renders %s as symbol in condensed mode', async (name, symbol) => {
    render(<KeybindingHint format="condensed" keys={name} />)
    await expect.element(page.getByText(symbol, {exact: true})).toBeInTheDocument()
  })

  it.each(['Plus', 'Space'])('renders %s as name in full format', async name => {
    render(<KeybindingHint format="full" keys={name} />)
    await expect.element(page.getByText(name, {exact: true})).toBeInTheDocument()
  })

  it('does not render plus signs in condensed mode', async () => {
    render(<KeybindingHint format="condensed" keys="control+b" />)
    await expect.element(page.getByText('+', {exact: true})).not.toBeInTheDocument()
  })

  it('renders plus signs between keys in full format', async () => {
    render(<KeybindingHint format="full" keys="control+b" />)
    const plus = page.getByText('+', {exact: true})
    await expect.element(plus).toBeVisible()
    await expect.element(plus).toHaveAttribute('aria-hidden')
  })

  it('renders sequences separated by hidden "then"', async () => {
    render(<KeybindingHint keys="Mod+A F" format="full" />)
    const el = page.getByText('then', {exact: true})
    await expect.element(el).toBeInTheDocument()
    await expect.element(el).not.toHaveAttribute('aria-hidden')
  })

  it('accepts className prop', async () => {
    render(<KeybindingHint keys="Control" className="test-class" />)
    await expect.element(page.getByTestId('keybinding-hint')).toHaveClass('test-class')
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

  it('returns "command" for "mod" on Apple platforms', () =>
    expect(getAccessibleKeybindingHintString('Mod+x', 'apple')).toBe('command x'))

  it('returns "control" for "mod" on non-Apple platforms', () => {
    expect(getAccessibleKeybindingHintString('Mod+x', 'windows')).toBe('control x')
    expect(getAccessibleKeybindingHintString('Mod+x', 'other')).toBe('control x')
  })

  it('returns "command" for "meta" on Apple platforms', () =>
    expect(getAccessibleKeybindingHintString('Meta+x', 'apple')).toBe('command x'))

  it('returns "Windows" for "meta" on Windows', () =>
    expect(getAccessibleKeybindingHintString('Meta+x', 'windows')).toBe('Windows x'))

  it('returns "meta" for "meta" on other platforms', () =>
    expect(getAccessibleKeybindingHintString('Meta+x', 'other')).toBe('meta x'))

  it('returns "option" for "alt" on Apple platforms and "alt" elsewhere', () => {
    expect(getAccessibleKeybindingHintString('Alt+x', 'apple')).toBe('option x')
    expect(getAccessibleKeybindingHintString('Alt+x', 'windows')).toBe('alt x')
    expect(getAccessibleKeybindingHintString('Alt+x', 'other')).toBe('alt x')
  })
})
