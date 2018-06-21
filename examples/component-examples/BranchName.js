import React from 'react'
import { Detail } from '@compositor/kit'
import Octicon from '@github/octicons-react'
import { BranchName } from '../../src'
import ExampleHeading from '../ExampleHeading'

const BranchNameExample =
  {
    name: 'BranchName',
    element: (
      <div>
        <BranchName>a_new_feature_branch</BranchName>
        <Detail>
          <ExampleHeading mt={3}>Linked BranchName</ExampleHeading>
          <BranchName tag='a' href='/'>a_new_feature_branch</BranchName>
          <ExampleHeading mt={3}>BranchName with Octicon</ExampleHeading>
          <BranchName><Octicon name='git-branch' /> a_new_feature_branch</BranchName>
        </Detail>
      </div>
    )
  }

export default BranchNameExample
