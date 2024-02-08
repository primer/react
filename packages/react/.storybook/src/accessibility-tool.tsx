import React, {useCallback} from 'react'
import {useGlobals} from '@storybook/api'
import {IconButton, Icons} from '@storybook/components'

export const ADDON_ID = 'show-surrounding-links'
export const TOOL_ID = `${ADDON_ID}/tool`

export const Tool = () => {
  const [{showSurroundingElements}, updateGlobals] = useGlobals()

  const toggleMyTool = useCallback(() => {
    const currentValue = showSurroundingElements ?? window?.localStorage.getItem('showSurroundingElements') === 'true'

    window?.localStorage?.setItem('showSurroundingElements', `${!currentValue}`)

    updateGlobals({
      showSurroundingElements: !currentValue,
    })
  }, [showSurroundingElements])

  return (
    <IconButton
      key={TOOL_ID}
      aria-label="Links before/after"
      title="Links before/after"
      onClick={toggleMyTool}
      defaultChecked={showSurroundingElements ?? window?.localStorage.getItem('showSurroundingElements') === 'true'}
      aria-pressed={showSurroundingElements ?? window?.localStorage.getItem('showSurroundingElements') === 'true'}
    >
      <Icons icon="accessibilityalt" />
    </IconButton>
  )
}
