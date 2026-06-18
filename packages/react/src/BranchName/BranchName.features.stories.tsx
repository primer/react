import type {Meta} from '@storybook/react-vite'
import React, {useState, useRef} from 'react'
import BranchName from './BranchName'
import {GitBranchIcon, CopyIcon, CheckIcon, TriangleDownIcon} from '@primer/octicons-react'
import {SelectPanel} from '../SelectPanel'
import type {ItemInput} from '../FilteredActionList'
import {announce} from '@primer/live-region-element'

export default {
  title: 'Components/BranchName/Features',
  component: BranchName,
} as Meta<typeof BranchName>

export const WithLeadingVisual = () => (
  <BranchName href="#">
    <BranchName.LeadingVisual>
      <GitBranchIcon />
    </BranchName.LeadingVisual>
    branch_name
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

export const WithDescription = ({
  branchName = 'fix/anchored-overlay-outside-top-autogrow',
  repo = 'primer/react',
}: {
  branchName: string
  repo: string
}) => (
  <BranchName href={`https://github.com/${repo}/tree/${branchName}`} description={`${repo}:${branchName}`}>
    {branchName}
  </BranchName>
)

export const WithTrailingAction = ({
  branchName = 'fix/anchored-overlay-outside-top-autogrow',
  repo = 'primer/react',
}: {
  branchName: string
  repo: string
}) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    setCopied(true)
    void navigator.clipboard.writeText(branchName)
    announce('Copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <BranchName href={`https://github.com/${repo}/tree/${branchName}`} description={`${repo}:${branchName}`}>
      {branchName}
      <BranchName.TrailingAction
        icon={copied ? CheckIcon : CopyIcon}
        aria-label="Copy branch name to clipboard"
        onClick={handleCopy}
      />
    </BranchName>
  )
}

export const WithTrailingActionMenu = ({repo = 'primer/react'}: {repo: string}) => {
  const branches: ItemInput[] = [
    {text: 'main', id: 'main'},
    {text: 'mp/test-combobox-unrendered-listbox', id: 'mp/test-combobox-unrendered-listbox'},
    {text: 'mp/rwd-stack-wrap-demo', id: 'mp/rwd-stack-wrap-demo'},
    {text: 'mp/rm-box-and-sx-from-underlinenav', id: 'mp/rm-box-and-sx-from-underlinenav'},
    {text: 'mp/rm-box-and-sx-from-pageheader', id: 'mp/rm-box-and-sx-from-pageheader'},
    {text: 'mp/prototype-datatable-API', id: 'mp/prototype-datatable-API'},
    {text: 'mp/fake-for-screenshot', id: 'mp/fake-for-screenshot'},
    {text: 'mp/add-statelabel-stories', id: 'mp/add-statelabel-stories'},
    {text: 'mo/2156-filtered-list-layout', id: 'mo/2156-filtered-list-layout'},
    {text: 'mitigate-hydration-mismatches', id: 'mitigate-hydration-mismatches'},
  ]

  const [selected, setSelected] = useState<ItemInput>(branches[0])
  const [filter, setFilter] = useState('')
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const filteredBranches = branches.filter(branch => branch.text?.toLowerCase().includes(filter.toLowerCase()))

  const handleSelectedChange = (newSelected: ItemInput | undefined) => {
    if (newSelected) {
      setSelected(newSelected)
    }
  }

  return (
    <>
      <BranchName href={`https://github.com/${repo}/tree/${selected.text}`}>
        {selected.text}
        <BranchName.TrailingAction
          icon={TriangleDownIcon}
          aria-label="Change base branch"
          ref={anchorRef}
          onClick={() => setOpen(!open)}
        />
      </BranchName>
      <SelectPanel
        renderAnchor={null}
        anchorRef={anchorRef}
        placeholder="Find a branch..."
        open={open}
        onOpenChange={setOpen}
        items={filteredBranches}
        selected={selected}
        onSelectedChange={handleSelectedChange}
        onFilterChange={setFilter}
        title="Change base branch"
        overlayProps={{width: 'medium'}}
      />
    </>
  )
}

export const KitchenSink = ({
  branchName = 'fix/anchored-overlay-outside-top-autogrow',
  repo = 'primer/react',
}: {
  branchName: string
  repo: string
}) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    setCopied(true)
    void navigator.clipboard.writeText(branchName)
    announce('Copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <BranchName href={`https://github.com/${repo}/tree/${branchName}`} description={`${repo}:${branchName}`}>
      <BranchName.LeadingVisual>
        <GitBranchIcon />
      </BranchName.LeadingVisual>
      {branchName}
      <BranchName.TrailingAction
        icon={copied ? CheckIcon : CopyIcon}
        aria-label="Copy branch name to clipboard"
        onClick={handleCopy}
      />
    </BranchName>
  )
}
