import {CheckIcon, CopyIcon, GitBranchIcon, TriangleDownIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {cn} from '../../internal/cn'
import {IconButton} from '../IconButton'
import {BranchName} from './BranchName'

const meta = {title: 'React Tailwind/Display/BranchName/Features', component: BranchName} satisfies Meta<
  typeof BranchName
>
export default meta
type Story = StoryObj<typeof meta>
const trailingActionContainerClassName = 'inline-flex flex-nowrap items-stretch gap-px rounded-md bg-accent-muted'
const trailingActionButtonClassName =
  'relative h-auto w-auto px-1.5 py-0.5 text-link before:absolute before:inset-y-1 before:-left-px before:w-px before:bg-[var(--borderColor-accent-muted)] [&_svg]:size-3'
export const WithBranchIcon: Story = {
  render: () => (
    <BranchName href="#">
      <span className="flex items-center gap-2">
        <GitBranchIcon />
        branch_name
      </span>
    </BranchName>
  ),
}
export const NotALink: Story = {args: {as: 'span', children: 'branch_name_as_span'}}
export const LinkWithoutHref: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-2">
      <BranchName>branch_name_as_a</BranchName>
      <BranchName>branch_name_no_as</BranchName>
    </div>
  ),
}
export const NoProps: Story = {args: {children: 'branch_name_no_props'}}
export const WithTrailingAction: Story = {
  render: function WithTrailingActionStory() {
    const branchName = 'fix/anchored-overlay-outside-top-autogrow'
    const [copied, setCopied] = useState(false)
    return (
      <span className={trailingActionContainerClassName}>
        <BranchName className="bg-transparent" href={`https://github.com/primer/react/tree/${branchName}`}>
          {branchName}
        </BranchName>
        <IconButton
          icon={copied ? CheckIcon : CopyIcon}
          aria-label="Copy branch name to clipboard"
          size="small"
          variant="invisible"
          className={cn(trailingActionButtonClassName, copied && 'text-success')}
          onClick={() => setCopied(true)}
        />
      </span>
    )
  },
}
export const WithTrailingActionMenu: Story = {
  render: () => (
    <span className={trailingActionContainerClassName}>
      <BranchName className="bg-transparent" href="https://github.com/primer/react/tree/main">
        main
      </BranchName>
      <IconButton
        icon={TriangleDownIcon}
        aria-label="Change base branch"
        size="small"
        variant="invisible"
        className={trailingActionButtonClassName}
        aria-haspopup="listbox"
      />
    </span>
  ),
}
