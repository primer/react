import type {Meta, StoryObj} from '@storybook/react-vite'
import {IssueLabel} from './IssueLabel'
const meta = {
  title: 'React Tailwind/Content/IssueLabel',
  component: IssueLabel,
  args: {children: 'bug'},
} satisfies Meta<typeof IssueLabel>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {args: {variant: 'red', href: '#label'}}
