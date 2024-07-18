import Text from '../Text'
import type {ReactNode} from 'react'
import React, {Fragment, memo} from 'react'
import VisuallyHidden from '../_VisuallyHidden'

import {accessibleKeyName, condensedKeyName, fullKeyName} from './key-names'

export interface KeybindingHintProps {
  /**
   * The keys involved in this keybinding. These should be the full names of the keys as would
   * be returned by `KeyboardEvent.key` (e.g. "Control", "Shift", "ArrowUp", "a", etc.).
   *
   * Combine keys with the "+" character to form chords. To represent the "+" key, use "Plus".
   *
   * Combine chords/keys with " " to form sequences that should be pressed one after the other. For example, "a b"
   * represents "a then b". To represent the " " key, use "Space".
   *
   * The fake key name "Mod" can be used to represent "Command" on macOS and "Control" on other platforms.
   *
   * See https://github.com/github/hotkey for format details.
   */
  keys: string
  /**
   * Control the display format. Condensed is most useful in menus and tooltips, while
   * the full form is better for prose.
   * @default "condensed"
   */
  format?: KeybindingHintFormat
  /**
   * Set to `onEmphasis` for display on emphasis colors.
   */
  variant?: KeybindingHintVariant
}

type KeybindingHintFormat = 'condensed' | 'full'

type KeybindingHintVariant = 'normal' | 'onEmphasis'

/**
 * Consistent sort order for modifier keys. There should never be more than one non-modifier
 * key in a shortcut, so we don't need to worry about sorting those - we just put them at
 * the end.
 */
const keySortPriorities = {
  control: 1,
  meta: 2,
  alt: 3,
  option: 4,
  shift: 5,
  function: 6,
  /** Maximum value for pushing other keys to end. */
  DEFAULT: 7,
} as const

function isValidKeySortPriority(priority: string): priority is keyof typeof keySortPriorities {
  return priority in keySortPriorities
}

function getKeySortPriorityValue(priority: string) {
  if (isValidKeySortPriority(priority)) {
    return keySortPriorities[priority]
  }
  return keySortPriorities.DEFAULT
}

/** `kbd` element with style resets. */
const Kbd = ({children}: {children: ReactNode}) => (
  <Text
    as={'kbd' as 'span'}
    sx={{
      color: 'inherit',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      border: 'none',
      background: 'none',
      boxShadow: 'none',
      p: 0,
      lineHeight: 'unset',
      position: 'relative',
      overflow: 'visible',
      verticalAlign: 'baseline',
    }}
  >
    {children}
  </Text>
)

interface KeyProps {
  name: string
  format: KeybindingHintFormat
}

const Key = ({name, format}: KeyProps) => (
  <>
    <VisuallyHidden>{accessibleKeyName(name)}</VisuallyHidden>
    <span aria-hidden>{format === 'condensed' ? condensedKeyName(name) : fullKeyName(name)}</span>
  </>
)

/** Split and sort the chord keys in standard order. */
const splitChord = (chord: string) =>
  chord
    .split('+')
    .map(k => k.toLowerCase())
    .sort(compareLowercaseKeys)

const compareLowercaseKeys = (a: string, b: string) => getKeySortPriorityValue(a) - getKeySortPriorityValue(b)

const accessibleChordString = (chord: string) => splitChord(chord).map(accessibleKeyName).join(' ')

const Chord = ({keys, format = 'condensed', variant = 'normal'}: KeybindingHintProps) => (
  <Text
    sx={{
      display: 'inline-flex',
      bg: variant === 'onEmphasis' ? 'transparent' : 'canvas.default',
      color: variant === 'onEmphasis' ? 'fg.onEmphasis' : 'fg.muted',
      border: '1px solid',
      borderColor: 'border.default',
      borderRadius: 2,
      fontWeight: 'normal',
      fontFamily: 'normal',
      fontSize: 0,
      p: 1,
      gap: '0.5ch',
      boxShadow: 'none',
      verticalAlign: 'baseline',
      overflow: 'hidden',
      lineHeight: '10px',
    }}
  >
    {splitChord(keys).map((k, i) => (
      <Fragment key={i}>
        {i > 0 && format === 'full' ? (
          <span aria-hidden> + </span> // hiding the plus sign helps screen readers be more concise
        ) : (
          ' ' // space is nonvisual due to flex layout but critical for labelling / screen readers
        )}

        <Key name={k} format={format} />
      </Fragment>
    ))}
  </Text>
)

const splitSequence = (sequence: string) => sequence.split(' ')

const accessibleSequenceString = (sequence: string) =>
  splitSequence(sequence).map(accessibleChordString).join(', then ')

/**
 * Indicates the presence of a keybinding available for an action.
 */
// KeybindingHint is a good candidate for memoizing since props will almost never change
export const KeybindingHint = memo(({keys, format = 'condensed', variant}: KeybindingHintProps) => (
  <Kbd>
    {splitSequence(keys).map((c, i) => (
      <Fragment key={i}>
        {
          //  Since we audibly separate individual keys in chord with space, we need some other separator for chords in a sequence
          i > 0 && (
            <>
              <VisuallyHidden>, then</VisuallyHidden>{' '}
            </>
          )
        }
        <Chord keys={c} format={format} variant={variant} />
      </Fragment>
    ))}
  </Kbd>
))
KeybindingHint.displayName = 'KeybindingHint'

/**
 * AVOID: `KeybindingHint` is nearly always sufficient for providing both visible and accessible keyboard hints, and
 * will result in a good screen reader experience when used as the target for `aria-describedby` and `aria-labelledby`.
 * However, there may be cases where we need a plain string version, such as when building `aria-label` or
 * `aria-description`. In that case, this plain string builder can be used instead.
 *
 * NOTE that this string should _only_ be used when building `aria-label` or `aria-description` props (never rendered
 * visibly) and should nearly always also be paired with a visible hint for sighted users.
 */
export const getAccessibleKeybindingHintString = (keys: string) => accessibleSequenceString(keys)
