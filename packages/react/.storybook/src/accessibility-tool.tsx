import React, {useCallback} from 'react'
import {useGlobals} from 'storybook/manager-api'
import {IconButton} from 'storybook/internal/components'
import {AccessibilityAltIcon} from '@storybook/icons'

export const ADDON_ID = 'show-surrounding-links'
export const TOOL_ID = `${ADDON_ID}/tool`

export const Tool = () => {
  const [{showSurroundingElements}, updateGlobals] = useGlobals()

  const toggleMyTool = useCallback(() => {
    const currentValue = showSurroundingElements ?? window.localStorage.getItem('showSurroundingElements') === 'true'

    window.localStorage.setItem('showSurroundingElements', `${!currentValue}`)

    updateGlobals({
      showSurroundingElements: !currentValue,
    })
  }, [showSurroundingElements, updateGlobals])

  return (
    <IconButton
      key={TOOL_ID}
      aria-label="Links before/after"
      title="Links before/after"
      onClick={toggleMyTool}
      // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
      defaultChecked={showSurroundingElements ?? window.localStorage.getItem('showSurroundingElements') === 'true'}
      // eslint-disable-next-line ssr-friendly/no-dom-globals-in-react-fc
      aria-pressed={showSurroundingElements ?? window.localStorage.getItem('showSurroundingElements') === 'true'}
    >
      <AccessibilityAltIcon />
    </IconButton>
  )
}
