import React, {useCallback} from 'react'
import {useGlobals, useStorybookApi} from 'storybook/manager-api'
import {IconButton} from 'storybook/internal/components'
import {LightningIcon} from '@storybook/icons'

export const ADDON_ID = 'primer-performance-monitor'
export const TOOL_ID = `${ADDON_ID}/tool`
export const PANEL_ID = `${ADDON_ID}/panel`

export const Tool = () => {
  const [{performanceMonitor}, updateGlobals] = useGlobals()
  const api = useStorybookApi()

  const togglePerformanceMonitor = useCallback(() => {
    const isCurrentlyEnabled = performanceMonitor ?? false

    // Update global state
    updateGlobals({
      performanceMonitor: !isCurrentlyEnabled,
    })

    // Show/hide the panel
    if (!isCurrentlyEnabled) {
      api.setSelectedPanel(PANEL_ID)
      api.togglePanel(true)
    }
  }, [performanceMonitor, updateGlobals, api])

  return (
    <IconButton
      key={TOOL_ID}
      aria-label="Performance Monitor"
      title="Performance Monitor"
      onClick={togglePerformanceMonitor}
      active={performanceMonitor ?? false}
      aria-pressed={performanceMonitor ?? false}
    >
      <LightningIcon />
    </IconButton>
  )
}
