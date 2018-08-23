import React from 'react'
import {LiveEditor} from '@compositor/kit'
import MergeButton from '../doc-components/MergeButton'

export default {
  name: 'MergeButton',
  element: (
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
  )
}
