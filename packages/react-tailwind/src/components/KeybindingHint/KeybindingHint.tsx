'use client'

import React from 'react'
import {cn} from '../../internal/cn'
import {accessibleKeyName, condensedKeyName, fullKeyName, splitChord, usePlatform} from './utils'

export interface KeybindingHintProps {
  /** Shortcut to render, written in the platform-independent chord syntax such as `Mod+s`. */
  keys: string
  /** Whether modifiers render as symbols or as full words. */
  format?: 'condensed' | 'full'
  /** Colour treatment, for hints shown on an emphasized or primary background. */
  variant?: 'default' | 'onEmphasis' | 'onPrimary'
  /** Text size of the hint. */
  size?: 'small' | 'medium'
  className?: string
}

export const KeybindingHint = React.memo(function KeybindingHint({
  className,
  format = 'condensed',
  keys,
  size = 'medium',
  variant = 'default',
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
                : 'rounded-md p-1 text-xs leading-[10px]',
              size !== 'small' && variant === 'default' && 'min-w-5',
              variant === 'default' && 'border-default bg-transparent text-muted',
              variant === 'onEmphasis' && 'border-transparent bg-[var(--counter-bgColor-emphasis)] text-on-emphasis',
              variant === 'onPrimary' &&
                'border-transparent bg-[var(--button-primary-bgColor-active)] text-on-emphasis',
            )}
          >
            {splitChord(chord).map((key, keyIndex) => (
              <React.Fragment key={`${key}-${keyIndex}`}>
                {keyIndex > 0 && format === 'full' ? <span aria-hidden="true"> + </span> : ' '}
                <span className="sr-only">{accessibleKeyName(key, currentPlatform)}</span>
                <span aria-hidden="true">
                  {format === 'full' ? fullKeyName(key, currentPlatform) : condensedKeyName(key, currentPlatform)}
                </span>
              </React.Fragment>
            ))}
          </span>
        </React.Fragment>
      ))}
    </kbd>
  )
})
