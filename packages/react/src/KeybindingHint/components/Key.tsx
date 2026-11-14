import VisuallyHidden from '../../_VisuallyHidden'
import {accessibleKeyName, condensedKeyName, fullKeyName} from '../key-names'
import type {KeybindingHintFormat, KeybindingHintProps} from '../props'
import {usePlatform} from '../platform'
import classes from '../KeybindingHint.modernize.module.css'

interface KeyProps {
  name: string
  format: KeybindingHintFormat
  variant: KeybindingHintProps['variant']
  size: KeybindingHintProps['size']
}

/** Renders a single key with accessible alternative text. */
export const Key = ({name, format, variant, size}: KeyProps) => {
  const platform = usePlatform()
  const label = format === 'condensed' ? condensedKeyName(name, platform) : fullKeyName(name, platform)

  return (
    <>
      <VisuallyHidden>{accessibleKeyName(name, platform)}</VisuallyHidden>
      <span
        aria-hidden
        className={classes.Key}
        data-component="KeybindingHint.Key"
        data-size={size}
        data-variant={variant}
        data-single-character={Array.from(label).length === 1 || undefined}
      >
        {label}
      </span>
    </>
  )
}
