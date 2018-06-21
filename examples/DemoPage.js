import React from 'react'
import { Library, LiveEditor } from '@compositor/kit'
import SideNav from './SideNav'
import MergeBox from './demos/MergeBox'
import MergeButton from  './demos/MergeButton'

const examples = [
  {
    name: 'MergeBox',
    element: (
      <span className='mr-2'>
        <LiveEditor code={`<MergeBox state='pending' numCommits={21} repoUrl={'https://github.com/primer/primer-react'} branchName={'master'}/>`} scope={{MergeBox}}/>
      </span>
    )
  },
  {
    name: 'MergeButton',
    element: (
      <span className='mr-2'>
        <LiveEditor code={`<MergeButton scheme='primary'/>`} scope={{MergeButton}}/>
      </span>
    )
  }
]

const DemoPage = () => {
  return (
    <Library
      basename='/docs/demos'
      title='Demo Library'
      examples={examples}
      renderSideNav={({
      title,
      examples,
    }) => (
      <SideNav title={title} examples={examples}/>
    )}/>
  )
}

export default DemoPage
