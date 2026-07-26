import type {Meta, StoryObj} from '@storybook/react-vite'
import {
  BoldIcon,
  CodeIcon,
  FileAddedIcon,
  HeadingIcon,
  ItalicIcon,
  KebabHorizontalIcon,
  LinkIcon,
  ListOrderedIcon,
  ListUnorderedIcon,
  NoteIcon,
  PencilIcon,
  QuoteIcon,
  ReplyIcon,
  SearchIcon,
  TasklistIcon,
  ThreeBarsIcon,
} from '@primer/octicons-react'
import {type ComponentProps, useState} from 'react'
import {ActionMenu} from '../ActionMenu'
import {Avatar} from '../Avatar'
import {Button} from '../Button'
import {IconButton} from '../IconButton'
import {Text} from '../Text'
import {Textarea} from '../Textarea'
import {ActionBar} from './ActionBar'

const meta = {
  title: 'React Tailwind/Data/ActionBar/Examples',
  component: ActionBar,
} satisfies Meta<typeof ActionBar>

export default meta

type Story = StoryObj<typeof meta>

function FormattingBar({size, gap = 'condensed'}: Pick<ComponentProps<typeof ActionBar>, 'gap' | 'size'>) {
  return (
    <ActionBar aria-label="Toolbar" gap={gap} size={size}>
      <ActionBar.IconButton aria-label="Bold" icon={BoldIcon} />
      <ActionBar.IconButton aria-label="Italic" icon={ItalicIcon} />
      <ActionBar.IconButton aria-label="Code" icon={CodeIcon} />
      <ActionBar.IconButton aria-label="Link" icon={LinkIcon} />
      <ActionBar.Divider />
      <ActionBar.IconButton aria-label="File Added" icon={FileAddedIcon} />
      <ActionBar.IconButton aria-label="Search" icon={SearchIcon} />
    </ActionBar>
  )
}

function CommentBoxContent() {
  const [value, setValue] = useState('')
  return (
    <div className="flex w-full max-w-[800px] flex-col rounded-md border border-default bg-default text-default">
      <header className="flex gap-4 rounded-t-md bg-muted">
        <div className="flex h-[37px] basis-0">
          <Button variant="invisible">Write</Button>
          <Button variant="invisible">Preview</Button>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-end pr-1">
          <ActionBar aria-label="Comment box toolbar" className="flex-1 justify-end overflow-hidden px-0" gap="none">
            <ActionBar.IconButton aria-label="Heading" icon={HeadingIcon} />
            <ActionBar.IconButton aria-label="Bold" icon={BoldIcon} />
            <ActionBar.IconButton aria-label="Italic" icon={ItalicIcon} />
            <ActionBar.IconButton aria-label="Insert Code" icon={CodeIcon} />
            <ActionBar.IconButton aria-label="Insert Link" icon={LinkIcon} />
            <ActionBar.Divider />
            <ActionBar.IconButton aria-label="Insert Quote" icon={QuoteIcon} />
            <ActionBar.IconButton aria-label="Unordered List" icon={ListUnorderedIcon} />
            <ActionBar.IconButton aria-label="Ordered List" icon={ListOrderedIcon} />
            <ActionBar.IconButton aria-label="Task List" icon={TasklistIcon} />
            <ActionBar.IconButton aria-label="Saved Replies" icon={ReplyIcon} />
          </ActionBar>
        </div>
      </header>
      <Textarea
        aria-label="Markdown value"
        id="markdowninput"
        value={value}
        onChange={event => setValue(event.target.value)}
      />
    </div>
  )
}

export const WithGroups: Story = {
  render: () => (
    <ActionBar aria-label="Toolbar">
      <ActionBar.Group>
        <ActionBar.IconButton aria-label="Bold" icon={BoldIcon} />
        <ActionBar.IconButton aria-label="Italic" icon={ItalicIcon} />
        <ActionBar.IconButton aria-label="Code" icon={CodeIcon} />
        <ActionBar.IconButton aria-label="Link" icon={LinkIcon} />
      </ActionBar.Group>
      <ActionBar.Divider />
      <ActionBar.Group>
        <ActionBar.IconButton aria-label="File Added" icon={FileAddedIcon} />
        <ActionBar.IconButton aria-label="Search" icon={SearchIcon} />
      </ActionBar.Group>
      <ActionBar.Group>
        <ActionBar.IconButton aria-label="Unordered List" icon={ListUnorderedIcon} />
        <ActionBar.IconButton aria-label="Ordered List" icon={ListOrderedIcon} />
      </ActionBar.Group>
      <ActionBar.IconButton aria-label="Task List" icon={TasklistIcon} />
      <ActionBar.IconButton aria-label="Saved Replies" icon={ReplyIcon} />
    </ActionBar>
  ),
}

export const SmallActionBar: Story = {render: () => <FormattingBar size="small" />}

export const WithTextButtons: Story = {
  render: () => (
    <ActionBar aria-label="Toolbar">
      <ActionBar.Button>Save</ActionBar.Button>
      <ActionBar.Button leadingVisual={FileAddedIcon}>Add file</ActionBar.Button>
      <ActionBar.Button leadingVisual={SearchIcon}>Search</ActionBar.Button>
      <ActionBar.Divider />
      <ActionBar.Button>Cancel</ActionBar.Button>
      <ActionBar.Button disabled>Disabled</ActionBar.Button>
    </ActionBar>
  ),
}

export const GapScale: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <Text as="p" className="mb-1 text-[16px] leading-6">
          gap=&quot;none&quot;
        </Text>
        <ActionBar aria-label="Toolbar gap none" gap="none">
          <ActionBar.IconButton aria-label="Bold" icon={BoldIcon} />
          <ActionBar.IconButton aria-label="Italic" icon={ItalicIcon} />
          <ActionBar.IconButton aria-label="Code" icon={CodeIcon} />
        </ActionBar>
      </div>
      <div>
        <Text as="p" className="mb-1 text-[16px] leading-6">
          gap=&quot;condensed&quot; (default)
        </Text>
        <ActionBar aria-label="Toolbar gap condensed" gap="condensed">
          <ActionBar.IconButton aria-label="Bold" icon={BoldIcon} />
          <ActionBar.IconButton aria-label="Italic" icon={ItalicIcon} />
          <ActionBar.IconButton aria-label="Code" icon={CodeIcon} />
        </ActionBar>
      </div>
    </div>
  ),
}

export const WithDisabledItems: Story = {
  render: () => (
    <ActionBar aria-label="Toolbar">
      <ActionBar.IconButton aria-label="Bold" icon={BoldIcon} />
      <ActionBar.IconButton aria-label="Italic" icon={ItalicIcon} />
      <ActionBar.IconButton aria-label="Code" icon={CodeIcon} />
      <ActionBar.IconButton aria-label="Link" icon={LinkIcon} />
      <ActionBar.Divider />
      <ActionBar.IconButton disabled aria-label="File Added" icon={FileAddedIcon} />
      <ActionBar.IconButton disabled aria-label="Search" icon={SearchIcon} />
      <ActionBar.IconButton disabled aria-label="Insert Quote" icon={QuoteIcon} />
      <ActionBar.IconButton aria-label="Unordered List" icon={ListUnorderedIcon} />
      <ActionBar.IconButton aria-label="Ordered List" icon={ListOrderedIcon} />
      <ActionBar.IconButton aria-label="Task List" icon={TasklistIcon} />
    </ActionBar>
  ),
}

export const CommentBox: Story = {
  render: () => <CommentBoxContent />,
}

export const ActionBarWithMenuTrigger: Story = {
  render: () => (
    <div>
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton aria-label="Bold" icon={BoldIcon} />
        <ActionBar.IconButton aria-label="Italic" icon={ItalicIcon} />
        <ActionBar.IconButton aria-label="Code" icon={CodeIcon} />
        <ActionBar.IconButton aria-label="Saved Replies" icon={ReplyIcon} />
      </ActionBar>
    </div>
  ),
}

export const ActionbarToggle: Story = {
  render: function ActionbarToggleStory() {
    const [editing, setEditing] = useState(false)
    return (
      <div className="border border-default p-4">
        <div className="flex flex-row justify-between border border-default bg-muted p-4">
          <div>
            <Avatar src="https://github.com/broccolinisoup.png" size={30} />
            <Text as="strong" className="mx-2">
              broccolinisoup
            </Text>
            <Text>opened this issue 2 hours ago</Text>
          </div>
          <ActionMenu>
            <ActionMenu.Trigger render={<IconButton aria-label="Open Menu" icon={ThreeBarsIcon} />} />
            <ActionMenu.Content>
              <ActionMenu.Item label="Copy Link">Copy Link</ActionMenu.Item>
              <ActionMenu.Item label="Quote reply">Quote reply</ActionMenu.Item>
              <ActionMenu.Item label="Edit" onClick={() => setEditing(true)}>
                <PencilIcon aria-hidden="true" /> Edit
              </ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu>
        </div>
        <div className="p-4">
          {editing ? (
            <div>
              <CommentBoxContent />
              <div className="flex flex-row justify-end gap-2 p-2">
                <Button variant="primary" onClick={() => setEditing(false)}>
                  Save
                </Button>
                <Button variant="danger" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>No description Provided</div>
          )}
        </div>
      </div>
    )
  },
}

export const MultipleActionBars: Story = {
  render: function MultipleActionBarsStory() {
    const [firstVisible, setFirstVisible] = useState(false)
    const [secondVisible, setSecondVisible] = useState(false)
    return (
      <div>
        <div className="p-4">
          {firstVisible ? (
            <CommentBoxContent />
          ) : (
            <Button onClick={() => setFirstVisible(true)}>Show first commentBox</Button>
          )}
        </div>
        <div className="p-4">
          {secondVisible ? (
            <CommentBoxContent />
          ) : (
            <Button onClick={() => setSecondVisible(true)}>Show second commentBox</Button>
          )}
        </div>
      </div>
    )
  },
}

export const WithMenus: Story = {
  render: () => (
    <ActionBar aria-label="Toolbar">
      <ActionBar.IconButton aria-label="Italic" icon={ItalicIcon} />
      <ActionBar.IconButton aria-label="Code" icon={CodeIcon} />
      <ActionBar.IconButton aria-label="Link" icon={LinkIcon} />
      <ActionBar.Divider />
      <ActionBar.IconButton aria-label="File Added" icon={FileAddedIcon} />
      <ActionBar.IconButton aria-label="Search" icon={SearchIcon} />
      <ActionBar.IconButton disabled aria-label="File Added" icon={FileAddedIcon} />
      <ActionBar.IconButton disabled aria-label="Search" icon={SearchIcon} />
      <ActionBar.IconButton disabled aria-label="Insert Quote" icon={QuoteIcon} />
      <ActionBar.IconButton aria-label="Unordered List" icon={ListUnorderedIcon} />
      <ActionBar.IconButton aria-label="Ordered List" icon={ListOrderedIcon} />
      <ActionBar.Menu
        aria-label="File options"
        icon={NoteIcon}
        items={[
          {label: 'Download'},
          {label: 'Jump to line'},
          {label: 'Find in file'},
          {label: 'Copy path'},
          {label: 'Copy permalink'},
          {label: 'Delete file'},
        ]}
      />
      <ActionBar.IconButton aria-label="Task List" icon={TasklistIcon} />
      <ActionBar.Menu
        aria-label="Formatting"
        icon={KebabHorizontalIcon}
        items={[{label: 'Bold'}, {label: 'Underline'}, {label: 'Headings'}]}
      />
    </ActionBar>
  ),
}
