import React from 'react'
import VisuallyHidden from '../../_VisuallyHidden'
import {accessibleKeyName, condensedKeyName, fullKeyName} from '../key-names'
import type {KeybindingHintFormat} from '../props'

interface KeyProps {
  name: string
  format: KeybindingHintFormat
}

/** Renders a single key with accessible alternative text. */
export const Key = ({name, format}: KeyProps) => (
  <>
    <VisuallyHidden>{accessibleKeyName(name)}</VisuallyHidden>
    <span aria-hidden>{format === 'condensed' ? condensedKeyName(name) : fullKeyName(name)}</span>
  </>
)
