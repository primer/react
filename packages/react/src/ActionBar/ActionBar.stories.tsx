import React from 'react'
import {Meta} from '@storybook/react'
import ActionBar from '.'
import {BoldIcon, CodeIcon, ItalicIcon, SearchIcon, LinkIcon, FileAddedIcon} from '@primer/octicons-react'

export default {
  title: 'Components/ActionBar',
  component: ActionBar,
} as Meta<typeof ActionBar>

export const Default = () => (
  <ActionBar>
    <ActionBar.IconButton icon={BoldIcon} aria-label="Default"></ActionBar.IconButton>
    <ActionBar.IconButton icon={ItalicIcon} aria-label="Default"></ActionBar.IconButton>
    <ActionBar.IconButton icon={CodeIcon} aria-label="Default"></ActionBar.IconButton>
    <ActionBar.IconButton icon={LinkIcon} aria-label="Default"></ActionBar.IconButton>
    <ActionBar.Divider />
    <ActionBar.IconButton icon={FileAddedIcon} aria-label="Default"></ActionBar.IconButton>
    <ActionBar.IconButton icon={SearchIcon} aria-label="Default"></ActionBar.IconButton>
  </ActionBar>
)

export const SmallActionBar = () => (
  <ActionBar size="small">
    <ActionBar.IconButton icon={BoldIcon} aria-label="Default"></ActionBar.IconButton>
    <ActionBar.IconButton icon={ItalicIcon} aria-label="Default"></ActionBar.IconButton>
    <ActionBar.IconButton icon={CodeIcon} aria-label="Default"></ActionBar.IconButton>
    <ActionBar.IconButton icon={LinkIcon} aria-label="Default"></ActionBar.IconButton>
    <ActionBar.Divider />
    <ActionBar.IconButton icon={FileAddedIcon} aria-label="Default"></ActionBar.IconButton>
    <ActionBar.IconButton icon={SearchIcon} aria-label="Default"></ActionBar.IconButton>
  </ActionBar>
)
