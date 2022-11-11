import React, {useCallback} from 'react'
import {useGlobals} from '@storybook/api'
import {IconButton, ThemeProvider, Tooltip} from '../../src'
import {AccessibilityIcon} from '@primer/octicons-react'

export const ADDON_ID = 'myaddon'
export const TOOL_ID = `${ADDON_ID}/tool`

export const Tool = () => {
  const [{showSurroundingElements, colorScheme}, updateGlobals] = useGlobals()

  const toggleMyTool = useCallback(
    () =>
      updateGlobals({
        showSurroundingElements: !showSurroundingElements
      }),
    [showSurroundingElements]
  )

  return (
    <ThemeProvider colorMode="day" dayScheme={colorScheme}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <Tooltip aria-label={`${showSurroundingElements ? 'Hide' : 'Show'} surrounding elements`} direction="s">
          <IconButton
            key={TOOL_ID}
            icon={AccessibilityIcon}
            aria-pressed={!!showSurroundingElements}
            aria-label={`${showSurroundingElements ? 'Hide' : 'Show'} surrounding elements`}
            onClick={toggleMyTool}
          />
        </Tooltip>
      </div>
    </ThemeProvider>
  )
}
