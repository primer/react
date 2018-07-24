import React from 'react'
import Octicon, {GitBranch} from '@githubprimer/octicons-react'
import {Detail, LiveEditor} from '@compositor/kit'
import ExampleHeading from '../doc-components/ExampleHeading'
import {BranchName} from '../../src'

const linkedBranch = `<BranchName tag="a" href="/">
  a_new_feature_branch
</BranchName>`

const branchOcticon = `<BranchName>
  <Octicon icon={GitBranch} />
  a_new_feature_branch
</BranchName>`

const BranchNameExample = {
  name: 'BranchName',
  element: (
    <div>
      <LiveEditor code={`<BranchName>a_new_feature_branch</BranchName>`} scope={{BranchName}} />
      <Detail>
        <ExampleHeading mt={3}>Linked BranchName</ExampleHeading>
        <LiveEditor code={linkedBranch} scope={{BranchName}} />
        <ExampleHeading mt={3}>BranchName with Octicon</ExampleHeading>
        <LiveEditor scope={{BranchName, GitBranch, Octicon}} code={branchOcticon} />
      </Detail>
    </div>
  )
}

export default BranchNameExample
