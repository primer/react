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
  args: {'aria-label': 'Toolbar', flush: false, gap: 'condensed', size: 'medium'},
  argTypes: {
    flush: {control: 'boolean'},
    gap: {control: 'radio', options: ['none', 'condensed']},
    size: {control: 'radio', options: ['small', 'medium', 'large']},
  },
  render: args => (
    <ActionBar {...args}>
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
} satisfies Meta<typeof ActionBar>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}

export const Playground: Story = {
  render: args => (
    <ActionBar {...args}>
      <ActionBar.IconButton icon={BoldIcon} aria-label="Bold" />
      <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic" />
      <ActionBar.Divider />
      <ActionBar.IconButton icon={CodeIcon} aria-label="Code" />
    </ActionBar>
  ),
}

const BoldButton = () => <ActionBar.IconButton icon={BoldIcon} aria-label="Bold" />

const FormattingButtons = () => (
  <>
    <BoldButton />
    <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic" />
    <ActionBar.IconButton icon={CodeIcon} aria-label="Code" />
    <ActionBar.IconButton icon={LinkIcon} aria-label="Link" />
  </>
)

const AdvancedFormattingButtons = () => (
  <>
    <ActionBar.IconButton icon={FileAddedIcon} aria-label="File Added" />
    <ActionBar.IconButton icon={SearchIcon} aria-label="Search" />
    <ActionBar.IconButton icon={QuoteIcon} aria-label="Insert Quote" />
    <ActionBar.IconButton icon={ListUnorderedIcon} aria-label="Unordered List" />
    <ActionBar.IconButton icon={ListOrderedIcon} aria-label="Ordered List" />
    <ActionBar.IconButton icon={TasklistIcon} aria-label="Task List" />
  </>
)

/** Items nested inside other components still join the bar's focus order and overflow menu. */
export const DeepChildTree: Story = {
  render: args => (
    <ActionBar {...args}>
      <FormattingButtons />
      <ActionBar.Divider />
      <AdvancedFormattingButtons />
    </ActionBar>
  ),
}

export const MultipleKeybindingHints: Story = {
  render: args => (
    <ActionBar {...args}>
      <ActionBar.IconButton icon={BoldIcon} aria-label="Bold" keybindingHint={['Mod+B', 'Control+B']} />
      <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic" keybindingHint={['Mod+I', 'Control+I']} />
      <ActionBar.IconButton icon={CodeIcon} aria-label="Code" keybindingHint="Mod+E" />
    </ActionBar>
  ),
}
