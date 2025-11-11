import type {Meta} from '@storybook/react-vite'
import BranchName from './BranchName'
import {Stack} from '../Stack'
import Octicon from '../Octicon'
import {GitBranchIcon} from '@primer/octicons-react'

export default {
  title: 'Components/BranchName/Features',
  component: BranchName,
} as Meta<typeof BranchName>

export const WithBranchIcon = () => (
  <BranchName href="#">
    <Stack direction="horizontal" gap="condensed" align="center">
      <Octicon icon={GitBranchIcon} />
      branch_name
    </Stack>
  </BranchName>
)

export const NotALink = () => <BranchName as="span">branch_name_as_span</BranchName>

export const LinkWithoutHref = () => (
  <div style={{display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start'}}>
    <BranchName as="a">branch_name_as_a</BranchName>
    <BranchName>branch_name_no_as</BranchName>
  </div>
)

export const NoProps = () => <BranchName>branch_name_no_props</BranchName>
