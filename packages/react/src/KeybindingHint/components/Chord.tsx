import {Fragment} from 'react'
import Text from '../../Text'
import type {KeybindingHintProps} from '../props'
import {Key} from './Key'
import {accessibleKeyName} from '../key-names'

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

const backgroundColors = {
  normal: 'var(--bgColor-transparent)',
  onEmphasis: 'var(--counter-bgColor-emphasis)',
  onPrimary: 'var(--button-primary-bgColor-active)',
}

export const Chord = ({keys, format = 'condensed', variant = 'normal', size = 'normal'}: KeybindingHintProps) => (
  <Text
    sx={{
      display: 'inline-flex',
      bg: backgroundColors[variant],
      color: variant === 'normal' ? 'var(--fgColor-muted)' : 'var(--fgColor-onEmphasis)',
      border: '1px solid',
      borderColor: variant === 'normal' ? 'var(--borderColor-default)' : 'transparent',
      borderRadius: size === 'small' ? 1 : 2,
      fontWeight: 'normal',
      fontFamily: 'normal',
      fontSize: size === 'small' ? '11px' : 0,
      p: size === 'small' ? '2px' : 1,
      gap: '0.5ch',
      boxShadow: 'none',
      verticalAlign: 'baseline',
      overflow: 'hidden',
      lineHeight: size === 'small' ? '8px' : '10px',
      minWidth: size === 'small' ? 'var(--base-size-16)' : 'var(--base-size-20)',
      justifyContent: 'center',
    }}
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
