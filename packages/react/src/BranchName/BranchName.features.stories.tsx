import type {Meta} from '@storybook/react-vite'
import React, {useState} from 'react'
import BranchName from './BranchName'
import {Stack} from '../Stack'
import Octicon from '../Octicon'
import {GitBranchIcon, CopyIcon, CheckIcon, TriangleDownIcon} from '@primer/octicons-react'
import {IconButton} from '../Button'
import {Tooltip} from '../TooltipV2'
import {VisuallyHidden} from '../VisuallyHidden'
import {Announce} from '../live-region'
import {SelectPanel} from '../SelectPanel'
import type {ItemInput} from '../FilteredActionList'
import {clsx} from 'clsx'

import styles from './BranchName.stories.module.css'

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
    setTimeout(() => setCopied(false), 2000)
  }

  const tooltipText = copied ? 'Copied!' : 'Copy branch name to clipboard'

  return (
    <span className={styles.BranchNameWithTrailingAction}>
      <Tooltip text={`${repo}:${branchName}`}>
        <BranchName href={`https://github.com/${repo}/tree/${branchName}`} className={styles.BranchNameTransparent}>
          {branchName}
        </BranchName>
      </Tooltip>
      {/* Screen reader announcement for copy success */}
      {copied && (
        <VisuallyHidden>
          <Announce>Copied!</Announce>
        </VisuallyHidden>
      )}
      <Tooltip text={tooltipText} aria-hidden>
        <IconButton
          icon={copied ? CheckIcon : CopyIcon}
          aria-label="Copy branch name to clipboard"
          variant="invisible"
          size="small"
          onClick={handleCopy}
          className={clsx(styles.TrailingActionButton, copied && styles.TrailingActionButtonCopied)}
        />
      </Tooltip>
    </span>
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

  const filteredBranches = branches.filter(branch => branch.text?.toLowerCase().includes(filter.toLowerCase()))

  const handleSelectedChange = (newSelected: ItemInput | undefined) => {
    if (newSelected) {
      setSelected(newSelected)
    }
  }

  return (
    <span className={styles.BranchNameWithTrailingAction}>
      <BranchName href={`https://github.com/${repo}/tree/${selected.text}`} className={styles.BranchNameTransparent}>
        {selected.text}
      </BranchName>
      <SelectPanel
        renderAnchor={anchorProps => (
          <IconButton
            icon={TriangleDownIcon}
            aria-label="Change base branch"
            variant="invisible"
            size="small"
            className={styles.TrailingActionButton}
            {...anchorProps}
          />
        )}
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
    </span>
  )
}
