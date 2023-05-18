declare module 'fzy.js' {
  // as defined by https://github.com/jhawthorn/fzy.js/blob/master/index.js#L189
  export const SCORE_MIN: typeof Infinity // for -Infinity
  export const SCORE_MAX: typeof Infinity

  export const SCORE_GAP_LEADING: number
  export const SCORE_GAP_TRAILING: number
  export const SCORE_GAP_INNER: number
  export const SCORE_MATCH_CONSECUTIVE: number
  export const SCORE_MATCH_SLASH: number
  export const SCORE_MATCH_WORD: number
  export const SCORE_MATCH_CAPITAL: number
  export const SCORE_MATCH_DOT: number

  /**
   * score
   * @param searchQuery - the user filter (the "needle")
   * @param text - full text of the item being matched (the "haystack")
   * @returns the score
   */
  export function score(searchQuery: string, text: string): number
  /**
   * positions
   * @param searchQuery - the user filter (the "needle")
   * @param text - full text of the item being matched (the "haystack")
   * @returns the position for each character match in the sequence
   */
  export function positions(searchQuery: string, text: string): Array<number>
  /**
   * hasMatch
   * @param searchQuery - the user filter (the "needle")
   * @param text - full text of the item being matched (the "haystack")
   * @returns whether or not there is a match in the sequence
   */
  export function hasMatch(searchQuery: string, text: string): boolean
}
