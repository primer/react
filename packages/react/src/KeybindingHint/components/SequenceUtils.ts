import type {Platform} from '../platform'
import {accessibleChordString} from './ChordUtils'

export const splitSequence = (sequence: string) => sequence.split(' ')

/** Plain string version of `Sequence` for use in `aria` string attributes. */
export const accessibleSequenceString = (sequence: string, platform: Platform) =>
  splitSequence(sequence)
    .map(chord => accessibleChordString(chord, platform))
    .join(' then ')
