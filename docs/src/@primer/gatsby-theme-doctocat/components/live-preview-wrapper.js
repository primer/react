import {BaseStyles, Box} from '../../../../../src'
import React from 'react'

// Users can shadow this file to wrap live previews.
// This is useful for applying global styles.
function LivePreviewWrapper({children}) {
  return (
    <BaseStyles>
      <Box p={3}>{children}</Box>
    </BaseStyles>
  )
}

export default LivePreviewWrapper
