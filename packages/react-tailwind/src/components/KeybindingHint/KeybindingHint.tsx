import React from 'react'
import {cn} from '../../internal/cn'

export interface KeybindingHintProps {
  keys: string
  format?: 'condensed' | 'full'
  variant?: 'normal' | 'onEmphasis' | 'onPrimary'
  size?: 'small' | 'normal'
  className?: string
}
const keyNames: Record<string, string> = {
  Control: 'Ctrl',
  Command: '⌘',
  Alt: 'Alt',
  Shift: 'Shift',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Escape: 'Esc',
  Enter: '↵',
  Backspace: '⌫',
  Delete: 'Del',
  Space: 'Space',
  Plus: '+',
}
function formatKey(key: string, format: 'condensed' | 'full') {
  if (format === 'full') return key === 'Mod' ? 'Command or Control' : key === 'Plus' ? '+' : key
  return key === 'Mod' ? '⌘/Ctrl' : (keyNames[key] ?? key)
}
export const KeybindingHint = React.memo(function KeybindingHint({
  className,
  format = 'condensed',
  keys,
  size = 'normal',
  variant = 'normal',
}: KeybindingHintProps) {
  const chords = keys.split(' ').filter(Boolean)
  return (
    <kbd
      className={cn(
        'whitespace-nowrap border-0 bg-transparent p-0 font-inherit align-baseline',
        size === 'small' ? 'text-sm' : 'text-base',
        variant === 'normal' ? 'text-muted' : 'text-on-emphasis',
        className,
      )}
      data-component="KeybindingHint"
      data-testid="keybinding-hint"
    >
      {chords.map((chord, index) => (
        <React.Fragment key={`${chord}-${index}`}>
          {index > 0 ? (
            <>
              <span className="sr-only">then</span>{' '}
            </>
          ) : null}
          {chord.split('+').map((key, keyIndex) => (
            <React.Fragment key={`${key}-${keyIndex}`}>
              {keyIndex > 0 ? <span aria-hidden="true">+</span> : null}
              {formatKey(key, format)}
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </kbd>
  )
})
