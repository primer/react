import type {Meta, StoryObj} from '@storybook/react-vite'
import {BranchName} from './BranchName'

const meta = {
  title: 'React Tailwind/Display/BranchName',
  component: BranchName,
} satisfies Meta<typeof BranchName>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {children: 'main', href: '#'}}
export const Playground: Story = {args: {children: 'feature/a-long-branch-name', href: '#'}}
