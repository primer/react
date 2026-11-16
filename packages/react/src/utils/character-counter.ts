/**
 * Shared character counting helpers for text inputs with character limits.
 * Provides the pure derivation used to render the counter and validation state.
 */

export const SCREEN_READER_DELAY = 500

export interface CharacterCountState {
  /**
   * Number of characters remaining before the limit is reached, or the number of
   * characters over the limit when it has been exceeded.
   */
  count: number
  /** Whether the current length exceeds the limit. */
  isOverLimit: boolean
  /** Human readable description of the remaining or over count. */
  message: string
}

/**
 * Compute the character count state for a given length and limit. This is a pure
 * function so the counter can be derived during render without component state.
 */
export function getCharacterCountState(currentLength: number, maxLength: number): CharacterCountState {
  const charactersRemaining = maxLength - currentLength

  if (charactersRemaining >= 0) {
    const characterText = charactersRemaining === 1 ? 'character' : 'characters'
    return {
      count: charactersRemaining,
      isOverLimit: false,
      message: `${charactersRemaining} ${characterText} remaining`,
    }
  }

  const charactersOver = -charactersRemaining
  const characterText = charactersOver === 1 ? 'character' : 'characters'
  return {
    count: charactersOver,
    isOverLimit: true,
    message: `${charactersOver} ${characterText} over`,
  }
}
