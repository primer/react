import Text from '../Text'
import type {ReactNode} from 'react'
import React, {Fragment, memo} from 'react'
import VisuallyHidden from '../_VisuallyHidden'

import {isMacOS} from '@primer/behaviors/utils'

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

// In the below records, we don't intend to cover every single possible key - only those that
// would be realistically used in shortcuts. For example, the Pause/Break key is not necessary
// because it is not found on many keyboards.

/**
 * Short-form iconic versions of keys. These should be intuitive and match icons on keyboards.
 */
const condensedKeys = (): Record<string, string> => ({
  alt: isMacOS() ? '⌥' : 'Alt', // the alt key _is_ the option key on MacOS - in the browser there is no "option" key
  control: '⌃',
  shift: '⇧',
  meta: isMacOS() ? '⌘' : 'Win',
  mod: isMacOS() ? '⌘' : '⌃',
  pageup: 'PgUp',
  pagedown: 'PgDn',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
  plus: '+', // needed to allow +-separated key names
  backspace: '⌫',
  delete: 'Del',
  space: '␣', // allow consumers to use the word "Space" even though it's not the browser key name, because it's more readable in props
  tab: '⇥',
  enter: '⏎',
  escape: 'Esc',
  function: 'Fn',
  capslock: 'CapsLock',
  insert: 'Ins',
  printscreen: 'PrtScn',
})

/**
 * Specific key displays for 'full' format. We still do show some icons (ie punctuation)
 * because that's more intuitive, but for the rest of keys we show the standard key name.
 */
const fullKeys = (): Record<string, string> => ({
  alt: isMacOS() ? 'Option' : 'Alt',
  mod: isMacOS() ? 'Command' : 'Control',
  '+': 'Plus',
  pageup: 'Page Up',
  pagedown: 'Page Down',
  arrowup: 'Up Arrow',
  arrowdown: 'Down Arrow',
  arrowleft: 'Left Arrow',
  arrowright: 'Right Arrow',
  capslock: 'Caps Lock',
  printscreen: 'Print Screen',
})

/**
 * Accessible key names intended to be read by a screen reader. This prevents screen
 * readers from expressing punctuation in speech, ie, reading a long pause instead of the
 * word "period".
 */
const keyDescriptions = (): Record<string, string> => ({
  alt: isMacOS() ? 'option' : 'alt',
  meta: isMacOS() ? 'command' : 'Windows',
  mod: isMacOS() ? 'command' : 'control',
  // Screen readers may not be able to pronounce concatenated words - this provides a better experience
  pageup: 'page up',
  pagedown: 'page down',
  arrowup: 'up arrow',
  arrowdown: 'down arrow',
  arrowleft: 'left arrow',
  arrowright: 'right arrow',
  capslock: 'caps lock',
  printscreen: 'print screen',
  // We don't need to represent _every_ symbol - only those found on standard keyboards.
  // Other symbols should be avoided as keyboard shortcuts anyway.
  // These should match the colloqiual names of the keys, not the names of the symbols. Ie,
  // "Equals" not "Equal Sign", "Dash" not "Minus", "Period" not "Dot", etc.
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
})

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

/**
 * Converts the first character of the string to upper case and the remaining to lower case.
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const capitalize = ([first, ...rest]: string) => (first?.toUpperCase() ?? '') + rest.join('').toLowerCase()

const keyToAccessibleString = (name: string) => keyDescriptions()[name] || name

const Key = ({name, format}: KeyProps) => (
  // We represent each individual key as a <kbd> inside a single container <kbd> element.
  // This requires a bit more styling to override the defaults but is the most semantic way
  // to do it:
  //
  //  > To describe an input comprised of multiple keystrokes, you can nest multiple <kbd>
  //  > elements, with an outer <kbd> element representing the overall input and each
  //  > individual keystroke or component of the input enclosed within its own <kbd>.
  //  > (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd#representing_keystrokes_within_an_input)
  <>
    <VisuallyHidden>{keyToAccessibleString(name)}</VisuallyHidden>
    {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
    <span aria-hidden>{(format === 'condensed' ? condensedKeys()[name] : fullKeys()[name]) ?? capitalize(name)}</span>
  </>
)

/** Split and sort the chord keys in standard order. */
const splitChord = (chord: string) =>
  chord
    .split('+')
    .map(k => k.toLowerCase())
    .sort(compareLowercaseKeys)

const compareLowercaseKeys = (a: string, b: string) => getKeySortPriorityValue(a) - getKeySortPriorityValue(b)

const chordToAccessibleString = (chord: string) => splitChord(chord).map(keyToAccessibleString).join(' ')

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

const sequenceToAccessibleString = (sequence: string) =>
  splitSequence(sequence).map(chordToAccessibleString).join(', then ')

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
export const getAccessibleKeybindingHintString = (keys: string) => sequenceToAccessibleString(keys)
