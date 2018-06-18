import React from 'react'
import {
  Example,
  Library
} from '@compositor/kit'
import Page from './Page'
import MergeBox from './demos/MergeBox'
import MergeButton from  './demos/MergeButton'

const DemoPage = () => {
  return (
    <Library title='Demo Library'>
      <Example name='MergeBox'>
        <span className='mr-2'>
          <MergeBox state='ready' numCommits={21} repoUrl={'https://github.com/primer/primer-react'} branchName={'master'}/>
        </span>
      </Example>
      <Example name='MergeButton'>
        <span className='mr-2'>
          <MergeButton scheme='primary'/>
        </span>
      </Example>
    </Library>
  )
}

export default DemoPage
