export type KeybindingHintFormat = 'condensed' | 'full'

export type KeybindingHintVariant = 'normal' | 'onEmphasis' | 'onPrimary'

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
   * Set to `onEmphasis` for display on emphasis colors, and `onPrimary` for display on primary buttons.
   */
  variant?: KeybindingHintVariant
  /**
   * Control the size of the hint.
   */
  size?: 'small' | 'normal'
  /**
   * Additional class name to apply to the hint.
   */
  className?: string
}
