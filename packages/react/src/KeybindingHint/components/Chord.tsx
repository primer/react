import {Fragment} from 'react'
import Text from '../../Text'
import type {KeybindingHintProps} from '../props'
import {Key} from './Key'
import {clsx} from 'clsx'
import classes from './Chord.module.css'
import {splitChord} from './utils'
import {usePlatform} from '../platform'

export const Chord = ({keys, format = 'condensed', variant = 'normal', size = 'normal'}: KeybindingHintProps) => {
  const platform = usePlatform()
  return (
    <Text
      data-kbd-chord
      className={clsx(classes.Chord, {
        [classes.ChordNormal]: variant === 'normal',
        [classes.ChordOnEmphasis]: variant === 'onEmphasis',
        [classes.ChordOnPrimary]: variant === 'onPrimary',
        [classes.ChordSmall]: size === 'small',
      })}
    >
      {splitChord(keys, platform).map((k, i) => (
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
}
