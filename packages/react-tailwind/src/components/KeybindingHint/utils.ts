'use client'

import {createContext, useContext, useSyncExternalStore} from 'react'

export type Platform = 'apple' | 'windows' | 'other'

const PlatformOverrideContext = createContext<Platform | null>(null)
const subscribe = () => () => {}

const getPlatform = (): Platform => {
  if (typeof navigator === 'undefined') return 'other'
  if (/mac|iphone|ipad|ipod/i.test(navigator.platform)) return 'apple'
  if (/win/i.test(navigator.platform)) return 'windows'
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

const keySortPriority = (key: string) => keySortPriorities[key] ?? Infinity

const accessibleKeyName = (key: string, platform: Platform) => {
  if (key === 'alt') return platform === 'apple' ? 'option' : 'alt'
  if (key === 'meta') return platform === 'apple' ? 'command' : platform === 'windows' ? 'Windows' : 'meta'
  if (key === 'mod') return platform === 'apple' ? 'command' : 'control'
  return accessibleKeyNames[key] ?? key.toLowerCase()
}

const accessibleChordString = (chord: string, platform: Platform) =>
  chord
    .split('+')
    .map(key => key.toLowerCase())
    .sort((a, b) => keySortPriority(a) - keySortPriority(b))
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
