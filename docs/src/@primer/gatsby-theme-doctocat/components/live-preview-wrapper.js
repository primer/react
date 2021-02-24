import {BaseStyles, Box} from '@primer/components'
import React from 'react'

// Users can shadow this file to wrap live previews.
// This is useful for applying global styles.
function LivePreviewWrapper({children}) {
  return (
    <Box width="100%">
      <BaseStyles>
        <Box p={3}>{children}</Box>
      </BaseStyles>
    </Box>
  )
}

export default LivePreviewWrapper
