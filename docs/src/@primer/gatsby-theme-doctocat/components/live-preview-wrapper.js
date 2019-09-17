import {BaseStyles, Box} from '@primer/components'
import Frame from './frame'
import React from 'react'

// Users can shadow this file to wrap live previews.
// This is useful for applying global styles.
function LivePreviewWrapper({children}) {
  return (
    <Frame>
      <BaseStyles>
        <Box p={3}>{children}</Box>
      </BaseStyles>
    </Frame>
  )
}

export default LivePreviewWrapper
