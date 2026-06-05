import {accessibleKeyName} from '../key-names'
import type {Platform} from '../platform'

/**
 * Consistent sort order for modifier keys. There should never be more than one non-modifier
 * key in a chord, so we don't need to worry about sorting those - we just put them at
 * the end.
 */
const keySortPriorities: Partial<Record<string, number>> = {
  control: 1,
  meta: 2,
  alt: 3,
  option: 4,
  shift: 5,
  function: 6,
}

const keySortPriority = (priority: string) => keySortPriorities[priority] ?? Infinity

const compareLowercaseKeys = (a: string, b: string) => keySortPriority(a) - keySortPriority(b)

/** Split and sort the chord keys in standard order. */
export const splitChord = (chord: string) =>
  chord
    .split('+')
    .map(k => k.toLowerCase())
    .sort(compareLowercaseKeys)

/** Plain string version of `Chord` for use in `aria` string attributes. */
export const accessibleChordString = (chord: string, platform: Platform) =>
  splitChord(chord)
    .map(key => accessibleKeyName(key, platform))
    .join(' ')
