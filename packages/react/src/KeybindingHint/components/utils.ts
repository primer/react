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

const keySortPriority = (key: string, platform: Platform) => {
  const resolvedKey = key === 'mod' ? (platform === 'apple' ? 'meta' : 'control') : key
  return keySortPriorities[resolvedKey] ?? Infinity
}

/** Split and sort the chord keys in standard order. */
export const splitChord = (chord: string, platform: Platform) =>
  chord
    .split('+')
    .map(k => k.toLowerCase())
    .sort((a, b) => keySortPriority(a, platform) - keySortPriority(b, platform))

const splitSequence = (sequence: string) => sequence.split(' ')

/** Plain string version of `Chord` for use in `aria` string attributes. */
export const accessibleChordString = (chord: string, platform: Platform) =>
  splitChord(chord, platform)
    .map(key => accessibleKeyName(key, platform))
    .join(' ')

/** Plain string version of `Sequence` for use in `aria` string attributes. */
export const accessibleSequenceString = (sequence: string, platform: Platform) =>
  splitSequence(sequence)
    .map(chord => accessibleChordString(chord, platform))
    .join(' then ')
