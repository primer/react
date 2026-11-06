import {render, screen} from '@testing-library/react'
import {expect, it} from 'vitest'
import {getAccessibleKeybindingHintString, KeybindingHint} from './index'
import {PlatformOverrideProvider, type Platform} from './utils'

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

it.each<[Platform, string, string]>([
  ['apple', '⌘⌥⌘', 'Command + Option + Command'],
  ['windows', 'WinAlt⌃', 'Windows + Alt + Control'],
  ['other', 'MetaAlt⌃', 'Meta + Alt + Control'],
])('renders platform-specific modifier labels on %s', (platform, condensed, full) => {
  const visibleText = (format: 'condensed' | 'full') => {
    const {container, unmount} = render(
      <PlatformOverrideProvider value={platform}>
        <KeybindingHint keys="Meta+Alt+Mod" format={format} />
      </PlatformOverrideProvider>,
    )
    const text = Array.from(container.querySelectorAll('[data-kbd-chord] > *:not(.sr-only)'))
      .map(element => element.textContent)
      .join('')
    unmount()
    return text
  }
  expect(visibleText('condensed')).toBe(condensed)
  expect(visibleText('full')).toBe(full)
})

it('only applies the minimum chord width to the default variant', () => {
  render(
    <>
      <KeybindingHint keys="g" />
      <KeybindingHint keys="n" variant="onPrimary" />
    </>,
  )
  const [defaultChord, primaryChord] = Array.from(document.querySelectorAll('[data-kbd-chord]'))
  expect(defaultChord).toHaveClass('min-w-5')
  expect(primaryChord).not.toHaveClass('min-w-5')
})
