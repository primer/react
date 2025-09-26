import {Fragment} from 'react'
import Text from '../../Text'
import type {KeybindingHintProps} from '../props'
import {Key} from './Key'
import {accessibleKeyName} from '../key-names'
import {clsx} from 'clsx'
import classes from './Chord.module.css'

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
const splitChord = (chord: string) =>
  chord
    .split('+')
    .map(k => k.toLowerCase())
    .sort(compareLowercaseKeys)

export const Chord = ({keys, format = 'condensed', variant = 'normal', size = 'normal'}: KeybindingHintProps) => (
  <Text
    className={clsx(classes.Chord, {
      [classes.ChordNormal]: variant === 'normal',
      [classes.ChordOnEmphasis]: variant === 'onEmphasis',
      [classes.ChordOnPrimary]: variant === 'onPrimary',
      [classes.ChordSmall]: size === 'small',
    })}
  >
    {splitChord(keys).map((k, i) => (
      <Fragment key={i}>
        {i > 0 && format === 'full' ? (
          <span aria-hidden> + </span> // hiding the plus sign helps screen readers be more concise
        ) : (
          ' ' // space is nonvisual due to flex layout but critical for labelling / screen readers
        )}

        <Key name={k} format={format} />
      </Fragment>
    ))}
  </Text>
)

/** Plain string version of `Chord` for use in `aria` string attributes. */
export const accessibleChordString = (chord: string, isMacOS: boolean) =>
  splitChord(chord)
    .map(key => accessibleKeyName(key, isMacOS))
    .join(' ')
