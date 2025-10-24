import {Fragment} from 'react'
import type {KeybindingHintProps} from '../props'
import VisuallyHidden from '../../_VisuallyHidden'
import {accessibleChordString, Chord} from './Chord'

const splitSequence = (sequence: string) => sequence.split(' ')

export const Sequence = ({keys, ...chordProps}: KeybindingHintProps) =>
  splitSequence(keys).map((c, i) => (
    <Fragment key={i}>
      {
        //  Since we audibly separate individual keys in chord with space, we need some other separator for chords in a sequence
        i > 0 && (
          <>
            <VisuallyHidden>then</VisuallyHidden>{' '}
          </>
        )
      }
      <Chord {...chordProps} keys={c} />
    </Fragment>
  ))

/** Plain string version of `Sequence` for use in `aria` string attributes. */
export const accessibleSequenceString = (sequence: string, isMacOS: boolean) =>
  splitSequence(sequence)
    .map(chord => accessibleChordString(chord, isMacOS))
    .join(' then ')
