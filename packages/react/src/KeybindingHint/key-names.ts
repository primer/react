// In the below records, we don't intend to cover every single possible key - only those that
// would be realistically used in shortcuts. For example, the Pause/Break key is not necessary
// because it is not found on many keyboards.

import {isMacOS} from '@primer/behaviors/utils'

// These are methods instead of plain objects to delay querying isMacOS and avoid SSR issues

/** Converts the first character of the string to upper case and the remaining to lower case. */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const capitalize = ([first, ...rest]: string) => (first?.toUpperCase() ?? '') + rest.join('').toLowerCase()

/**
 * Short-form iconic versions of keys. These should be intuitive and match icons on keyboards.
 */
export const condensedKeyName = (key: string) =>
  ({
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
  })[key] ?? capitalize(key)

/**
 * Specific key displays for 'full' format. We still do show some icons (ie punctuation)
 * because that's more intuitive, but for the rest of keys we show the standard key name.
 */
export const fullKeyName = (key: string) =>
  ({
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
  })[key] ?? capitalize(key)

/**
 * Accessible key names intended to be read by a screen reader. This prevents screen
 * readers from expressing punctuation in speech, ie, reading a long pause instead of the
 * word "period".
 */
export const accessibleKeyName = (key: string) =>
  ({
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
  })[key] ?? key.toLowerCase()
