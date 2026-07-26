import {render, screen} from '@testing-library/react'
import {expect, it} from 'vitest'
import {getAccessibleKeybindingHintString, KeybindingHint} from './index'

it('announces keys and sequence separators while hiding compact symbols', () => {
  render(<KeybindingHint keys="Mod+k g" />)
  expect(screen.getByText('control')).toHaveClass('sr-only')
  expect(screen.getByText('⌃')).toHaveAttribute('aria-hidden', 'true')
  expect(screen.getByText('then')).toHaveClass('sr-only')
  expect(screen.getByText('K')).toHaveAttribute('aria-hidden', 'true')
  expect(screen.getByText('G')).toHaveAttribute('aria-hidden', 'true')
})

it('returns readable names for punctuation', () => {
  expect(getAccessibleKeybindingHintString('{', false)).toBe('left curly brace')
})

it('joins keys in a chord with spaces', () => {
  expect(getAccessibleKeybindingHintString('Command+U', false)).toBe('command u')
})

it('sorts modifier keys in standard order', () => {
  expect(getAccessibleKeybindingHintString('Alt+Shift+Command+%', false)).toBe('alt shift command percent')
})

it('joins chords in a sequence with then', () => {
  expect(getAccessibleKeybindingHintString('Alt+9 x y', false)).toBe('alt 9 then x then y')
})

it('supports the legacy boolean platform argument', () => {
  expect(getAccessibleKeybindingHintString('Mod+x', true)).toBe('command x')
  expect(getAccessibleKeybindingHintString('Mod+x', false)).toBe('control x')
})

it('uses platform-specific names for Mod and Meta', () => {
  expect(getAccessibleKeybindingHintString('Mod+x', 'apple')).toBe('command x')
  expect(getAccessibleKeybindingHintString('Mod+x', 'windows')).toBe('control x')
  expect(getAccessibleKeybindingHintString('Mod+x', 'other')).toBe('control x')
  expect(getAccessibleKeybindingHintString('Meta+x', 'apple')).toBe('command x')
  expect(getAccessibleKeybindingHintString('Meta+x', 'windows')).toBe('Windows x')
  expect(getAccessibleKeybindingHintString('Meta+x', 'other')).toBe('meta x')
})

it('uses option for Alt on Apple platforms', () => {
  expect(getAccessibleKeybindingHintString('Alt+x', 'apple')).toBe('option x')
  expect(getAccessibleKeybindingHintString('Alt+x', 'windows')).toBe('alt x')
  expect(getAccessibleKeybindingHintString('Alt+x', 'other')).toBe('alt x')
})
