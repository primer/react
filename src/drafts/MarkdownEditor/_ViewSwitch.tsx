import React, {useContext} from 'react'
import {EyeIcon, PencilIcon} from '@primer/octicons-react'

import Box from '../../Box'
import {Button, IconButton} from '../../Button'
import {MarkdownEditorContext} from './_MarkdownEditorContext'

export type MarkdownViewMode = 'preview' | 'edit'

type ViewSwitchProps = {
  selectedView: MarkdownViewMode
  onViewSelect?: (view: MarkdownViewMode) => void
  disabled?: boolean
  /** Called when the preview should be loaded. */
  onLoadPreview: () => void
}

// no point in memoizing this component because onLoadPreview depends on value, so it would still re-render on every change
export const ViewSwitch = ({selectedView, onViewSelect, onLoadPreview, disabled}: ViewSwitchProps) => {
  // don't get disabled from context - the switch is not disabled when the editor is disabled
  const {condensed} = useContext(MarkdownEditorContext)

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
