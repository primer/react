import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {MergeStatus, Box} from '../../src'

const MergeStatusExample = {
  name: 'MergeStatus',
  element: (
    <div>
      <Box mb={2}>
        <LiveEditor code={`<MergeStatus state="pending" />`} scope={{MergeStatus}} />
      </Box>
      <Box mb={2}>
        <LiveEditor code={`<MergeStatus state="invalid" />`} scope={{MergeStatus}} />
      </Box>
      <Box mb={2}>
        <LiveEditor code={`<MergeStatus state="merged" />`} scope={{MergeStatus}} />
      </Box>
      <Box mb={2}>
        <LiveEditor code={`<MergeStatus state="ready" />`} scope={{MergeStatus}} />
      </Box>
    </div>
  )
}

export default MergeStatusExample
