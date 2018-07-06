import React from 'react'
import Octicon, {GitBranch} from '@github/octicons-react'
import {Detail} from '@compositor/kit'
import ExampleHeading from '../doc-components/ExampleHeading'
import {BranchName} from '../../src'

const BranchNameExample = {
  name: 'BranchName',
  element: (
    <div>
      <BranchName>a_new_feature_branch</BranchName>
      <Detail>
        <ExampleHeading mt={3}>Linked BranchName</ExampleHeading>
        <BranchName tag="a" href="/">
          a_new_feature_branch
        </BranchName>
        <ExampleHeading mt={3}>BranchName with Octicon</ExampleHeading>
        <BranchName>
          <Octicon icon={GitBranch} /> a_new_feature_branch
        </BranchName>
      </Detail>
    </div>
  )
}

export default BranchNameExample
