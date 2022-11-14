import React, {useCallback} from 'react'
import {useGlobals} from '@storybook/api'
import {ThemeProvider, ToggleSwitch, Box} from '../../src'

export const ADDON_ID = 'show-surrounding-links'
export const TOOL_ID = `${ADDON_ID}/tool`

export const Tool = () => {
  const [{showSurroundingElements, colorScheme}, updateGlobals] = useGlobals()

  const toggleMyTool = useCallback(() => {
    const currentValue = showSurroundingElements ?? window?.localStorage.getItem('showSurroundingElements') === 'true'

    window?.localStorage?.setItem('showSurroundingElements', `${!currentValue}`)

    updateGlobals({
      showSurroundingElements: !currentValue
    })
  }, [showSurroundingElements])

  return (
    <ThemeProvider colorMode="day" dayScheme={colorScheme}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <Box fontSize={1} fontWeight="bold" id={`${ADDON_ID}-label`} sx={{color: 'fg.default'}}>
          Wrap links
        </Box>
        <ToggleSwitch
          key={TOOL_ID}
          aria-labelledby={`${ADDON_ID}-label`}
          onClick={toggleMyTool}
          defaultChecked={showSurroundingElements ?? window?.localStorage.getItem('showSurroundingElements') === 'true'}
          checked={showSurroundingElements}
          size="small"
        />
      </div>
    </ThemeProvider>
  )
}
