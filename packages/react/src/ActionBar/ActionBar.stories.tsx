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
import type {Meta, StoryObj} from '@storybook/react-vite'

const meta: Meta<typeof ActionBar> = {
  title: 'Experimental/Components/ActionBar',
} as Meta<typeof ActionBar>

export default meta
type Story = StoryObj<typeof ActionBar>

export const Playground: Story = {
  render: args => (
    <ActionBar {...args}>
      <ActionBar.IconButton icon={BoldIcon} aria-label="Bold"></ActionBar.IconButton>
      <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic"></ActionBar.IconButton>
      <ActionBar.Divider />
      <ActionBar.IconButton icon={CodeIcon} aria-label="Code"></ActionBar.IconButton>
    </ActionBar>
  ),
}
Playground.argTypes = {
  size: {
    control: {
      type: 'radio',
    },
    options: ['small', 'medium', 'large'],
  },
  flush: {
    control: {
      type: 'boolean',
    },
  },
  gap: {
    control: {type: 'number', min: 0, max: 8, step: 1},
    description: 'Horizontal gap in pixels between items (0–8).',
  },
}
Playground.args = {
  size: 'medium',
  flush: false,
  gap: 8,
}

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

const BoldButton = () => <ActionBar.IconButton icon={BoldIcon} aria-label="Bold"></ActionBar.IconButton>

const FormattingButtons = () => (
  <>
    <BoldButton />
    <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic"></ActionBar.IconButton>
    <ActionBar.IconButton icon={CodeIcon} aria-label="Code"></ActionBar.IconButton>
    <ActionBar.IconButton icon={LinkIcon} aria-label="Link"></ActionBar.IconButton>
  </>
)

const AdvancedFormattingButtons = () => (
  <>
    <ActionBar.IconButton icon={FileAddedIcon} aria-label="File Added"></ActionBar.IconButton>
    <ActionBar.IconButton icon={SearchIcon} aria-label="Search"></ActionBar.IconButton>
    <ActionBar.IconButton icon={QuoteIcon} aria-label="Insert Quote"></ActionBar.IconButton>
    <ActionBar.IconButton icon={ListUnorderedIcon} aria-label="Unordered List"></ActionBar.IconButton>
    <ActionBar.IconButton icon={ListOrderedIcon} aria-label="Ordered List"></ActionBar.IconButton>
    <ActionBar.IconButton icon={TasklistIcon} aria-label="Task List"></ActionBar.IconButton>
  </>
)

export const DeepChildTree = () => (
  <ActionBar aria-label="Toolbar">
    <FormattingButtons />
    <ActionBar.Divider />
    <AdvancedFormattingButtons />
  </ActionBar>
)

export const GapExamples = () => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
    <ActionBar aria-label="Toolbar gap 0" gap={0}>
      <ActionBar.IconButton icon={BoldIcon} aria-label="Bold" />
      <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic" />
      <ActionBar.IconButton icon={CodeIcon} aria-label="Code" />
    </ActionBar>
    <ActionBar aria-label="Toolbar gap 4" gap={4}>
      <ActionBar.IconButton icon={BoldIcon} aria-label="Bold" />
      <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic" />
      <ActionBar.IconButton icon={CodeIcon} aria-label="Code" />
    </ActionBar>
    <ActionBar aria-label="Toolbar gap 8" gap={8}>
      <ActionBar.IconButton icon={BoldIcon} aria-label="Bold" />
      <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic" />
      <ActionBar.IconButton icon={CodeIcon} aria-label="Code" />
    </ActionBar>
  </div>
)
