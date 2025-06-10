import React, {useCallback} from 'react'
// eslint-disable-next-line import/named
import {useGlobals} from '@storybook/manager-api'
// eslint-disable-next-line import/named
import {IconButton, Icons} from '@storybook/components'

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
      <Icons icon="accessibilityalt" />
    </IconButton>
  )
}
