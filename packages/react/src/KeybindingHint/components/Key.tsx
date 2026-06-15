import VisuallyHidden from '../../_VisuallyHidden'
import {accessibleKeyName, condensedKeyName, fullKeyName} from '../key-names'
import type {KeybindingHintFormat} from '../props'
import {usePlatform} from '../platform'

interface KeyProps {
  name: string
  format: KeybindingHintFormat
}

/** Renders a single key with accessible alternative text. */
export const Key = ({name, format}: KeyProps) => {
  const platform = usePlatform()

  return (
    <>
      <VisuallyHidden>{accessibleKeyName(name, platform)}</VisuallyHidden>
      <span aria-hidden>{format === 'condensed' ? condensedKeyName(name, platform) : fullKeyName(name, platform)}</span>
    </>
  )
}
