import React from 'react'

import Box from '../../Box'
import TabNav from '../../TabNav'

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

  const sharedProps =
    selectedView === 'preview'
      ? {
          onClick: () => onViewSelect?.('edit'),
        }
      : {
          onClick: () => {
            onLoadPreview()
            onViewSelect?.('preview')
          },
          onMouseOver: () => onLoadPreview(),
          onFocus: () => onLoadPreview(),
        }

  return (
    <Box sx={{display: 'flex', flexDirection: 'row'}}>
      <TabNav aria-label="View mode">
        <TabNav.Link
          {...sharedProps}
          as="button"
          selected={selectedView === 'edit'}
          disabled={disabled}
          sx={{cursor: 'pointer', color: selectedView === 'edit' ? 'fg.default' : 'fg.muted', borderTopLeftRadius: 1}}
        >
          Write
        </TabNav.Link>
        <TabNav.Link
          {...sharedProps}
          as="button"
          selected={selectedView === 'preview'}
          disabled={disabled}
          sx={{
            cursor: 'pointer',
            color: selectedView === 'preview' ? 'fg.default' : 'fg.muted',
            borderTopLeftRadius: 1,
          }}
        >
          Preview
        </TabNav.Link>
      </TabNav>
    </Box>
  )
}
