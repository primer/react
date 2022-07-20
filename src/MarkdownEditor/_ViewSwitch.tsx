import React from 'react'
import {EyeIcon, PencilIcon} from '@primer/octicons-react'

import Box from '../Box'
import {Button, IconButton} from '../Button'

export type MarkdownViewMode = 'preview' | 'edit'

type ViewSwitchProps = {
  selectedView: MarkdownViewMode
  onViewSelect?: (view: MarkdownViewMode) => void
  condensed: boolean
  disabled?: boolean
  /** Called when the preview should be loaded. */
  onLoadPreview: () => void
}

export const ViewSwitch = ({selectedView, onViewSelect, condensed, disabled, onLoadPreview}: ViewSwitchProps) => {
  const {label, icon, ...sharedProps} =
    selectedView === 'preview'
      ? {
          variant: 'invisible',
          sx: {color: 'fg.default', px: 2},
          onClick: () => onViewSelect?.('edit'),
          icon: PencilIcon,
          label: 'Edit'
        }
      : {
          variant: 'invisible',
          sx: {color: 'fg.default', px: 2},
          onClick: () => {
            onLoadPreview()
            onViewSelect?.('preview')
          },
          onMouseOver: () => onLoadPreview(),
          onFocus: () => onLoadPreview(),
          icon: EyeIcon,
          label: 'Preview'
        }

  return (
    <Box sx={{display: 'flex', flexDirection: 'row'}}>
      {condensed ? (
        <IconButton {...sharedProps} disabled={disabled} icon={icon} label={label} />
      ) : (
        <Button {...sharedProps} leadingIcon={icon} disabled={disabled}>
          {label}
        </Button>
      )}
    </Box>
  )
}
