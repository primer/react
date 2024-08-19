import React from 'react'
import type {Meta} from '@storybook/react'
import ActionBar from '.'
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  SearchIcon,
  LinkIcon,
  FileAddedIcon,
  QuoteIcon,
  ListUnorderedIcon,
  ListOrderedIcon,
  TasklistIcon,
  ReplyIcon,
} from '@primer/octicons-react'
import {Box, Dialog, Button} from '../'
import {Divider} from '../deprecated/ActionList/Divider'

export default {
  title: 'Drafts/Components/ActionBar',
} as Meta<typeof ActionBar>

export const Default = () => (
  <ActionBar aria-label="Toolbar">
    <ActionBar.IconButton icon={BoldIcon} aria-label="Bold"></ActionBar.IconButton>
    <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic"></ActionBar.IconButton>
    <ActionBar.IconButton icon={CodeIcon} aria-label="Code"></ActionBar.IconButton>
    <ActionBar.IconButton icon={LinkIcon} aria-label="Link"></ActionBar.IconButton>
    <ActionBar.Divider />
    <ActionBar.IconButton icon={FileAddedIcon} aria-label="File Added"></ActionBar.IconButton>
    <ActionBar.IconButton icon={SearchIcon} aria-label="Search"></ActionBar.IconButton>
    <ActionBar.IconButton icon={QuoteIcon} aria-label="Insert Quote"></ActionBar.IconButton>
    <ActionBar.IconButton icon={ListUnorderedIcon} aria-label="Unordered List"></ActionBar.IconButton>
    <ActionBar.IconButton icon={ListOrderedIcon} aria-label="Ordered List"></ActionBar.IconButton>
    <ActionBar.IconButton icon={TasklistIcon} aria-label="Task List"></ActionBar.IconButton>
  </ActionBar>
)

export const SmallActionBar = () => (
  <ActionBar size="small" aria-label="Toolbar">
    <ActionBar.IconButton icon={BoldIcon} aria-label="Bold"></ActionBar.IconButton>
    <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic"></ActionBar.IconButton>
    <ActionBar.IconButton icon={CodeIcon} aria-label="Code"></ActionBar.IconButton>
    <ActionBar.IconButton icon={LinkIcon} aria-label="Link"></ActionBar.IconButton>
    <ActionBar.Divider />
    <ActionBar.IconButton icon={FileAddedIcon} aria-label="File Added"></ActionBar.IconButton>
    <ActionBar.IconButton icon={SearchIcon} aria-label="Search"></ActionBar.IconButton>
  </ActionBar>
)

export const ActionBarWithMenuTrigger = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const buttonRef = React.useRef(null)

  return (
    <Box>
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Bold"></ActionBar.IconButton>
        <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic"></ActionBar.IconButton>
        <ActionBar.IconButton icon={CodeIcon} aria-label="Code"></ActionBar.IconButton>
        <ActionBar.IconButton
          ref={buttonRef}
          onClick={() => setIsOpen(true)}
          icon={ReplyIcon}
          aria-label="Saved Replies"
        ></ActionBar.IconButton>
      </ActionBar>

      <Dialog aria-labelledby="header" returnFocusRef={buttonRef} isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <Dialog.Header id="header">Select a reply</Dialog.Header>
        <Box p={3}>Show saved replies</Box>
        <Divider />
        <Button variant="invisible">Create your own saved reply</Button>
      </Dialog>
    </Box>
  )
}
