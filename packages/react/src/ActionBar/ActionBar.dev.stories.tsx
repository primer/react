import React from 'react'
import type {Meta} from '@storybook/react'
import {ActionBar} from '../'
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
import {sxOverrideTestStyles} from '../utils/story-helpers'

export default {
  title: 'Experimental/Components/ActionBar/Dev',
  component: ActionBar,
} as Meta<typeof ActionBar>

export const SxPropStressTest = () => (
  <ActionBar aria-label="Toolbar">
    <ActionBar.IconButton sx={sxOverrideTestStyles} icon={BoldIcon} aria-label="Bold"></ActionBar.IconButton>
    <ActionBar.IconButton sx={sxOverrideTestStyles} icon={ItalicIcon} aria-label="Italic"></ActionBar.IconButton>
    <ActionBar.IconButton sx={sxOverrideTestStyles} icon={CodeIcon} aria-label="Code"></ActionBar.IconButton>
    <ActionBar.IconButton sx={sxOverrideTestStyles} icon={LinkIcon} aria-label="Link"></ActionBar.IconButton>
    <ActionBar.Divider />
    <ActionBar.IconButton sx={sxOverrideTestStyles} icon={FileAddedIcon} aria-label="File Added"></ActionBar.IconButton>
    <ActionBar.IconButton sx={sxOverrideTestStyles} icon={SearchIcon} aria-label="Search"></ActionBar.IconButton>
    <ActionBar.IconButton sx={sxOverrideTestStyles} icon={QuoteIcon} aria-label="Insert Quote"></ActionBar.IconButton>
    <ActionBar.IconButton
      sx={sxOverrideTestStyles}
      icon={ListUnorderedIcon}
      aria-label="Unordered List"
    ></ActionBar.IconButton>
    <ActionBar.IconButton
      sx={sxOverrideTestStyles}
      icon={ListOrderedIcon}
      aria-label="Ordered List"
    ></ActionBar.IconButton>
    <ActionBar.IconButton sx={sxOverrideTestStyles} icon={TasklistIcon} aria-label="Task List"></ActionBar.IconButton>
  </ActionBar>
)
