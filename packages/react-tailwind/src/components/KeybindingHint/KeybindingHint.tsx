'use client'

import React from 'react'
import {cn} from '../../internal/cn'
import {getAccessibleKeybindingHintString, usePlatform} from './utils'

export interface KeybindingHintProps {
  keys: string
  format?: 'condensed' | 'full'
  variant?: 'normal' | 'onEmphasis' | 'onPrimary'
  size?: 'small' | 'normal'
  className?: string
}
const condensedKeyNames: Record<string, string> = {
  alt: '⌥',
  control: '⌃',
  shift: '⇧',
  meta: '⌘',
  mod: '⌘',
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
}

const fullKeyNames: Record<string, string> = {
  alt: 'Option',
  meta: 'Command',
  mod: 'Command',
  plus: 'Plus',
  pageup: 'Page Up',
  pagedown: 'Page Down',
  arrowup: 'Up Arrow',
  arrowdown: 'Down Arrow',
  arrowleft: 'Left Arrow',
  arrowright: 'Right Arrow',
  capslock: 'Caps Lock',
  printscreen: 'Print Screen',
}

const capitalize = (key: string) => key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()

function displayKey(key: string, format: 'condensed' | 'full', currentPlatform: 'apple' | 'windows' | 'other') {
  const normalized = key.toLowerCase() === 'plus' ? 'plus' : key.toLowerCase()
  if (format === 'full') {
    if (normalized === 'mod') return currentPlatform === 'apple' ? 'Command' : 'Control'
    if (normalized === 'meta' && currentPlatform === 'windows') return 'Windows'
    if (normalized === 'alt' && currentPlatform !== 'apple') return 'Alt'
    return fullKeyNames[normalized] ?? capitalize(normalized)
  }
  if (normalized === 'mod') return currentPlatform === 'apple' ? '⌘' : '⌃'
  if (normalized === 'meta' && currentPlatform === 'windows') return 'Win'
  if (normalized === 'alt' && currentPlatform !== 'apple') return 'Alt'
  return condensedKeyNames[normalized] ?? capitalize(normalized)
}

const sortPriority: Record<string, number> = {control: 1, meta: 2, alt: 3, option: 4, shift: 5, function: 6}

export const KeybindingHint = React.memo(function KeybindingHint({
  className,
  format = 'condensed',
  keys,
  size = 'normal',
  variant = 'normal',
}: KeybindingHintProps) {
  const currentPlatform = usePlatform()
  const chords = keys.split(' ').filter(Boolean)
  return (
    <kbd
      className={cn(
        'relative overflow-visible whitespace-nowrap border-0 bg-transparent p-0 [font-family:inherit] [font-size:inherit] [line-height:inherit] align-baseline text-inherit shadow-none',
        className,
      )}
      data-component="KeybindingHint"
      data-testid="keybinding-hint"
    >
      {chords.map((chord, index) => (
        <React.Fragment key={`${chord}-${index}`}>
          {index > 0 && (
            <>
              <span className="sr-only">then</span>{' '}
            </>
          )}
          <span
            data-kbd-chord
            className={cn(
              'inline-flex justify-center gap-[0.5ch] overflow-hidden border font-normal align-baseline',
              size === 'small'
                ? 'min-w-4 rounded-sm p-0.5 text-[11px] leading-2'
                : 'min-w-5 rounded-md p-1 text-xs leading-[10px]',
              variant === 'normal' && 'border-default bg-transparent text-muted',
              variant === 'onEmphasis' && 'border-transparent bg-[var(--counter-bgColor-emphasis)] text-on-emphasis',
              variant === 'onPrimary' &&
                'border-transparent bg-[var(--button-primary-bgColor-active)] text-on-emphasis',
            )}
          >
            {chord
              .split('+')
              .map(key => key.toLowerCase())
              .sort((a, b) => (sortPriority[a] ?? Infinity) - (sortPriority[b] ?? Infinity))
              .map((key, keyIndex) => (
                <React.Fragment key={`${key}-${keyIndex}`}>
                  {keyIndex > 0 && format === 'full' ? <span aria-hidden="true"> + </span> : ' '}
                  <span className="sr-only">{getAccessibleKeybindingHintString(key, currentPlatform)}</span>
                  <span aria-hidden="true">{displayKey(key, format, currentPlatform)}</span>
                </React.Fragment>
              ))}
          </span>
        </React.Fragment>
      ))}
    </kbd>
  )
})
