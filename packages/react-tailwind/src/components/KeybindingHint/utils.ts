'use client'

import {createContext, useContext, useSyncExternalStore} from 'react'

export type Platform = 'apple' | 'windows' | 'other'

const PlatformOverrideContext = createContext<Platform | null>(null)
const subscribe = () => () => {}

const getPlatform = (): Platform => {
  if (typeof navigator === 'undefined') return 'other'
  if (/^mac/i.test(navigator.platform) || /iphone|ipad|ipod/i.test(`${navigator.platform} ${navigator.userAgent}`)) {
    return 'apple'
  }
  if (/^win/i.test(navigator.platform)) return 'windows'
  return 'other'
}

export const PlatformOverrideProvider = PlatformOverrideContext.Provider

export const usePlatform = (): Platform => {
  const override = useContext(PlatformOverrideContext)
  const detected: Platform = useSyncExternalStore(subscribe, getPlatform, (): Platform => 'other')
  return override ?? detected
}

const keySortPriorities: Partial<Record<string, number>> = {
  control: 1,
  meta: 2,
  alt: 3,
  option: 4,
  shift: 5,
  function: 6,
}

const accessibleKeyNames: Record<string, string> = {
  alt: 'alt',
  meta: 'meta',
  mod: 'control',
  pageup: 'page up',
  pagedown: 'page down',
  arrowup: 'up arrow',
  arrowdown: 'down arrow',
  arrowleft: 'left arrow',
  arrowright: 'right arrow',
  capslock: 'caps lock',
  printscreen: 'print screen',
  '`': 'backtick',
  '~': 'tilde',
  '!': 'exclamation point',
  '@': 'at',
  '#': 'hash',
  $: 'dollar sign',
  '%': 'percent',
  '^': 'caret',
  '&': 'ampersand',
  '*': 'asterisk',
  '(': 'left parenthesis',
  ')': 'right parenthesis',
  _: 'underscore',
  '-': 'dash',
  '+': 'plus',
  '=': 'equals',
  '[': 'left bracket',
  '{': 'left curly brace',
  ']': 'right bracket',
  '}': 'right curly brace',
  '\\': 'backslash',
  '|': 'pipe',
  ';': 'semicolon',
  ':': 'colon',
  "'": 'single quote',
  '"': 'double quote',
  ',': 'comma',
  '<': 'left angle bracket',
  '.': 'period',
  '>': 'right angle bracket',
  '/': 'forward slash',
  '?': 'question mark',
  ' ': 'space',
}

const condensedKeyNames: Record<string, string> = {
  control: '⌃',
  shift: '⇧',
  pageup: 'PgUp',
  pagedown: 'PgDn',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
  plus: '+',
  backspace: '⌫',
  delete: 'Del',
  space: '␣',
  tab: '⇥',
  enter: '⏎',
  escape: 'Esc',
  function: 'Fn',
  capslock: 'CapsLock',
  insert: 'Ins',
  printscreen: 'PrtScn',
}

const fullKeyNames: Record<string, string> = {
  '+': 'Plus',
  pageup: 'Page Up',
  pagedown: 'Page Down',
  arrowup: 'Up Arrow',
  arrowdown: 'Down Arrow',
  arrowleft: 'Left Arrow',
  arrowright: 'Right Arrow',
  capslock: 'Caps Lock',
  printscreen: 'Print Screen',
}

const keySortPriority = (key: string) => keySortPriorities[key] ?? Infinity

const capitalize = ([first = '', ...rest]: string) => first.toUpperCase() + rest.join('').toLowerCase()

/** Splits a chord such as `Shift+Mod+k` into lowercase keys in standard modifier order. */
export const splitChord = (chord: string) =>
  chord
    .split('+')
    .map(key => key.toLowerCase())
    .sort((a, b) => keySortPriority(a) - keySortPriority(b))

/** Short, iconic key label for the `condensed` format. Expects a lowercase key from `splitChord`. */
export const condensedKeyName = (key: string, platform: Platform) => {
  if (key === 'alt') return platform === 'apple' ? '⌥' : 'Alt'
  if (key === 'meta') return platform === 'apple' ? '⌘' : platform === 'windows' ? 'Win' : 'Meta'
  if (key === 'mod') return platform === 'apple' ? '⌘' : '⌃'
  return condensedKeyNames[key] ?? capitalize(key)
}

/** Full-word key label for the `full` format. Expects a lowercase key from `splitChord`. */
export const fullKeyName = (key: string, platform: Platform) => {
  if (key === 'alt') return platform === 'apple' ? 'Option' : 'Alt'
  if (key === 'meta') return platform === 'apple' ? 'Command' : platform === 'windows' ? 'Windows' : 'Meta'
  if (key === 'mod') return platform === 'apple' ? 'Command' : 'Control'
  return fullKeyNames[key] ?? capitalize(key)
}

/** Screen-reader key name, which avoids announcing punctuation as pauses. */
export const accessibleKeyName = (key: string, platform: Platform) => {
  if (key === 'alt') return platform === 'apple' ? 'option' : 'alt'
  if (key === 'meta') return platform === 'apple' ? 'command' : platform === 'windows' ? 'Windows' : 'meta'
  if (key === 'mod') return platform === 'apple' ? 'command' : 'control'
  return accessibleKeyNames[key] ?? key.toLowerCase()
}

const accessibleChordString = (chord: string, platform: Platform) =>
  splitChord(chord)
    .map(key => accessibleKeyName(key, platform))
    .join(' ')

/**
 * Builds a plain string keyboard shortcut description for use in an aria label or description.
 *
 * A boolean platform is supported for backwards compatibility. `true` maps to Apple and `false`
 * maps to other platforms.
 */
export const getAccessibleKeybindingHintString = (sequence: string, platform: Platform | boolean) => {
  const resolvedPlatform = typeof platform === 'boolean' ? (platform ? 'apple' : 'other') : platform
  return sequence
    .split(' ')
    .map(chord => accessibleChordString(chord, resolvedPlatform))
    .join(' then ')
}
