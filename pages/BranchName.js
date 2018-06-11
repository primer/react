import {Block, BranchName} from '../src'
import {Detail} from '@compositor/kit'
import {ExampleHeading} from '../lib'
import Octicon from '@github/octicons-react'

export default () => (
  <Block>
    <BranchName>a_new_feature_branch</BranchName>
    <Detail>
      <ExampleHeading mt={3}>Linked BranchName</ExampleHeading>
      <BranchName tag='a' href='/'>a_new_feature_branch</BranchName>
      <ExampleHeading mt={3}>BranchName with Octicon</ExampleHeading>
      <BranchName><Octicon name='git-branch' /> a_new_feature_branch</BranchName>
    </Detail>
  </Block>
)
