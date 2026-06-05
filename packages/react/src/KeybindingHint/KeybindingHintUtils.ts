import type {Platform} from './platform'
import {accessibleSequenceString} from './components/SequenceUtils'

/**
 * AVOID: `KeybindingHint` is nearly always sufficient for providing both visible and accessible keyboard hints.
 * However, there may be cases where we need a plain string version, such as when building `aria-label` or
 * `aria-description`. In that case, this plain string builder can be used instead.
 *
 * NOTE that this string should _only_ be used when building `aria-label` or `aria-description` props (never rendered
 * visibly) and should nearly always also be paired with a visible hint for sighted users.
 *
 * The `platform` argument controls how platform-specific keys (such as `Meta`, `Alt`, and `Mod`) are named. For
 * backwards compatibility, a `boolean` may be passed instead, where `true` is treated as `'apple'` and `false` as
 * `'other'`.
 */
export const getAccessibleKeybindingHintString = (sequence: string, platform: Platform | boolean) =>
  accessibleSequenceString(sequence, typeof platform === 'boolean' ? (platform ? 'apple' : 'other') : platform)
