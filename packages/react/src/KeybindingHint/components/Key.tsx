import VisuallyHidden from '../../_VisuallyHidden'
import {accessibleKeyName, condensedKeyName, fullKeyName} from '../key-names'
import type {KeybindingHintFormat} from '../props'
import {useIsMacOS} from '../../hooks/useIsMacOS'

interface KeyProps {
  name: string
  format: KeybindingHintFormat
}

/** Renders a single key with accessible alternative text. */
export const Key = ({name, format}: KeyProps) => {
  const isMacOS = useIsMacOS()

  return (
    <>
      <VisuallyHidden>{accessibleKeyName(name, isMacOS)}</VisuallyHidden>
      <span aria-hidden>{format === 'condensed' ? condensedKeyName(name, isMacOS) : fullKeyName(name, isMacOS)}</span>
    </>
  )
}
