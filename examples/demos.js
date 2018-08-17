import React from 'react'
import {Library, LiveEditor} from '@compositor/kit'
import SideNav from './doc-components/SideNav'
import MergeBox from './demos/MergeBox'
import MergeButton from './demos/MergeButton'
import {Box} from '../src'

const examples = [
  {
    name: 'MergeBox',
    element: (
      <Box p={4}>
        <LiveEditor
          code={`<MergeBox
  state='pending'
  numCommits={21}
  repoUrl='https://github.com/primer/primer-react'
  branchName='master'
  onMerge={() => alert('merge!')}
/>`}
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
          code={`<MergeButton
  primary
  numCommits={2}
  onClick={() => alert('merge!')}
/>`}
          scope={{MergeButton}}
        />
      </Box>
    )
  }
]

const DemoPage = () => {
  const basename = process.env.NODE_ENV === 'development' ? '/demos' : '/primer-react/demo'
  return (
    <Library
      basename={basename}
      title="Demo Library"
      examples={examples}
      renderSideNav={({title, examples}) => <SideNav title={title} examples={examples} />}
    />
  )
}

export default DemoPage
