import React from 'react'
import {LiveEditor} from '@compositor/kit'
import MergeBox from '../doc-components/MergeBox'

export default {
  name: 'MergeBox',
  element: (
    <LiveEditor
      code={`
<MergeBox
  state='pending'
  numCommits={21}
  repoUrl='https://github.com/primer/primer-react'
  branchName='master'
  onMerge={() => alert('merge!')}
/>
        `.trim()}
      scope={{MergeBox}}
    />
  )
}
