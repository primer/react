import {Fragment} from 'react'
import type {KeybindingHintProps} from '../props'
import VisuallyHidden from '../../_VisuallyHidden'
import {Chord} from './Chord'
import {splitSequence} from './SequenceUtils'

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
      <Chord keys={c} {...chordProps} />
    </Fragment>
  ))
