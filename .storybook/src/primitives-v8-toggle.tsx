import React, {useCallback} from 'react'
import {useGlobals} from '@storybook/api'
import {IconButton, Icons} from '@storybook/components'

export const ADDON_ID = 'toggle-primitives-v8'
export const TOOL_ID = `${ADDON_ID}/tool`

// options

// adopted stylesheets https://developer.mozilla.org/en-US/docs/Web/API/Document/adoptedStyleSheets
// works if we can get the text of the stylesheets

// condtionally import the index?
// inject into the dom?

export const Tool = () => {
  const [{showSurroundingElements, colorScheme}, updateGlobals] = useGlobals()

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
