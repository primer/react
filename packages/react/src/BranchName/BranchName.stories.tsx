import type {Meta} from '@storybook/react-vite'
import BranchName from './BranchName'

export default {
  title: 'Components/BranchName',
  component: BranchName,
} as Meta<typeof BranchName>

export const Default = () => <BranchName href="#">branch_name</BranchName>
