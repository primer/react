import type {Meta, StoryObj} from '@storybook/react-vite'
import {
  BoldIcon,
  CodeIcon,
  FileAddedIcon,
  ItalicIcon,
  LinkIcon,
  ListOrderedIcon,
  ListUnorderedIcon,
  QuoteIcon,
  SearchIcon,
  TasklistIcon,
} from '@primer/octicons-react'
import {ActionBar} from './ActionBar'
const meta = {
  title: 'React Tailwind/Data/ActionBar',
  component: ActionBar,
} satisfies Meta<typeof ActionBar>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <ActionBar aria-label="Toolbar">
      <ActionBar.IconButton icon={BoldIcon} aria-label="Bold" />
      <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic" />
      <ActionBar.IconButton icon={CodeIcon} aria-label="Code" />
      <ActionBar.IconButton icon={LinkIcon} aria-label="Link" />
      <ActionBar.Divider />
      <ActionBar.IconButton icon={FileAddedIcon} aria-label="File Added" />
      <ActionBar.IconButton icon={SearchIcon} aria-label="Search" />
      <ActionBar.IconButton icon={QuoteIcon} aria-label="Insert Quote" />
      <ActionBar.IconButton icon={ListUnorderedIcon} aria-label="Unordered List" />
      <ActionBar.IconButton icon={ListOrderedIcon} aria-label="Ordered List" />
      <ActionBar.IconButton icon={TasklistIcon} aria-label="Task List" />
    </ActionBar>
  ),
}
