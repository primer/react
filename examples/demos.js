import React from 'react'
import {LiveEditor} from '@compositor/kit'
import {Box} from '../src'
import {Library} from './doc-components'
import MergeBox from './demos/MergeBox'
import MergeButton from './demos/MergeButton'

const examples = [
  {
    name: 'MergeBox',
    element: (
      <Box p={4}>
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
      </Box>
    )
  },
  {
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
]

export default function DemoPage(props) {
  const basename = process.env.NODE_ENV === 'development' ? '/demos/' : '/primer-react/demo/'
  return (
    <Library basename={basename} title="Demo Library" examples={examples} {...props}>
      These are more involved demos that illustrate how to combine primer-react components into more interesting and/or
      useful ones.
    </Library>
  )
}
