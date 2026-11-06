'use client'

import React from 'react'
import {joinIdRefs} from '../../internal/idRefs'

interface ButtonLoadingAriaProps {
  'aria-describedby'?: string
  'aria-disabled'?: React.AriaAttributes['aria-disabled']
  'aria-label'?: string
  'aria-labelledby'?: string
}

/**
 * Loading semantics shared by Button and LinkButton. While loading, the control is busy and disabled for assistive
 * technology, keeps its visible label as its name, and adds the loading announcement ahead of consumer descriptions.
 */
export function useButtonLoading(loading: boolean, props: ButtonLoadingAriaProps) {
  const id = React.useId()
  const labelId = `${id}-label`
  const loadingAnnouncementId = `${id}-loading-announcement`

  return {
    labelId,
    loadingAnnouncementId,
    ariaProps: {
      'aria-busy': loading || undefined,
      'aria-describedby': loading
        ? joinIdRefs(loadingAnnouncementId, props['aria-describedby'])
        : props['aria-describedby'],
      'aria-disabled': loading || props['aria-disabled'],
      'aria-labelledby': loading
        ? (props['aria-labelledby'] ?? (props['aria-label'] ? undefined : labelId))
        : props['aria-labelledby'],
    },
  }
}
