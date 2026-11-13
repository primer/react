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
 * Loading semantics shared by Button and LinkButton. While loading, the control is disabled for assistive technology (without
 * `aria-busy`, which GitHub accessibility policy prohibits), keeps its visible label as its name, and adds any
 * loading announcement ahead of consumer descriptions.
 */
export function useButtonLoading(loading: boolean, loadingAnnouncement: string, props: ButtonLoadingAriaProps) {
  const id = React.useId()
  const labelId = `${id}-label`
  const loadingAnnouncementId = loading && loadingAnnouncement !== '' ? `${id}-loading-announcement` : undefined

  return {
    labelId,
    loadingAnnouncementId,
    ariaProps: {
      'aria-describedby': loadingAnnouncementId
        ? joinIdRefs(loadingAnnouncementId, props['aria-describedby'])
        : props['aria-describedby'],
      'aria-disabled': loading || props['aria-disabled'],
      'aria-labelledby': loading
        ? (props['aria-labelledby'] ?? (props['aria-label'] ? undefined : labelId))
        : props['aria-labelledby'],
    },
  }
}
