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
} from '@primer/octicons-react'

export default {
  title: 'Experimental/Components/ActionBar',
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
