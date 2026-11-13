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
        'primer:relative primer:overflow-visible primer:whitespace-nowrap primer:border-0 primer:bg-transparent primer:p-0 primer:[font-family:inherit] primer:[font-size:inherit] primer:[line-height:inherit] primer:align-baseline primer:text-inherit primer:shadow-none',
        className,
      )}
      data-component="KeybindingHint"
      data-testid="keybinding-hint"
    >
      {chords.map((chord, index) => (
        <React.Fragment key={`${chord}-${index}`}>
          {index > 0 && (
            <>
              <span className="primer:sr-only">then</span>{' '}
            </>
          )}
          <span
            data-kbd-chord
            className={cn(
              'primer:inline-flex primer:justify-center primer:gap-[0.5ch] primer:overflow-hidden primer:border-thin primer:font-normal primer:align-baseline',
              size === 'small'
                ? 'primer:min-w-4 primer:rounded-sm primer:p-0.5 primer:text-[11px] primer:leading-2'
                : 'primer:rounded-md primer:p-1 primer:text-xs primer:leading-[10px]',
              size !== 'small' && variant === 'default' && 'primer:min-w-5',
              variant === 'default' && 'primer:border-default primer:bg-transparent primer:text-muted',
              variant === 'onEmphasis' &&
                'primer:border-transparent primer:bg-[var(--counter-bgColor-emphasis)] primer:text-on-emphasis',
              variant === 'onPrimary' &&
                'primer:border-transparent primer:bg-[var(--button-primary-bgColor-active)] primer:text-on-emphasis',
            )}
          >
            {splitChord(chord).map((key, keyIndex) => (
              <React.Fragment key={`${key}-${keyIndex}`}>
                {keyIndex > 0 && format === 'full' ? <span aria-hidden="true"> + </span> : ' '}
                <span className="primer:sr-only">{accessibleKeyName(key, currentPlatform)}</span>
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
