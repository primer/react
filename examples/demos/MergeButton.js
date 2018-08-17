import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Box} from '../../src'
import MergeButton from '../doc-components/MergeButton'

export default {
  name: 'MergeButton',
  element: (
    <Box p={4}>
      <LiveEditor
        code={`
<MergeButton
  primary
  numCommits={2}
  onClick={() => alert('merge!')}
/>
          `.trim()}
        scope={{MergeButton}}
      />
    </Box>
  )
}
