import React from 'react'
import {
  Example,
  Library,
  LiveEditor
} from '@compositor/kit'
import Page from './Page'
import MergeBox from './demos/MergeBox'
import MergeButton from  './demos/MergeButton'



const DemoPage = () => {
  return (
    <Library title='Demo Library'>
      <Example name='MergeBox'>
        <span className='mr-2'>
          <LiveEditor code={`<MergeBox state='ready' numCommits={21} repoUrl={'https://github.com/primer/primer-react'} branchName={'master'}/>`} scope={{MergeBox}}/>
        </span>
      </Example>
      <Example name='MergeButton'>
        <span className='mr-2'>
          <LiveEditor code={`<MergeButton scheme='primary'/>`} scope={{MergeButton}}/>
        </span>
      </Example>
    </Library>
  )
}

export default DemoPage
