import React from 'react'
import type {Meta} from '@storybook/react-vite'
import ActionBar from '.'
import Text from '../Text'
import {
  PencilIcon,
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  SearchIcon,
  LinkIcon,
  FileAddedIcon,
  HeadingIcon,
  QuoteIcon,
  ListUnorderedIcon,
  ListOrderedIcon,
  TasklistIcon,
  ReplyIcon,
  ThreeBarsIcon,
  TrashIcon,
  KebabHorizontalIcon,
  NoteIcon,
} from '@primer/octicons-react'
import {Button, Avatar, ActionMenu, IconButton, ActionList, Textarea} from '..'
import {Dialog} from '../deprecated/DialogV1'
import {Divider} from '../deprecated/ActionList/Divider'
import mockData from '../experimental/SelectPanel2/mock-story-data'
import classes from './ActionBar.examples.stories.module.css'
import type {ActionBarMenuItem} from './ActionBar'

export default {
  title: 'Experimental/Components/ActionBar/Examples',
} as Meta<typeof ActionBar>

export const WithGroups = () => (
  <ActionBar aria-label="Toolbar">
    <ActionBar.Group>
      <>
        <ActionBar.IconButton icon={BoldIcon} aria-label="Bold"></ActionBar.IconButton>
        <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic"></ActionBar.IconButton>
        <ActionBar.IconButton icon={CodeIcon} aria-label="Code"></ActionBar.IconButton>
        <ActionBar.IconButton icon={LinkIcon} aria-label="Link"></ActionBar.IconButton>
      </>
    </ActionBar.Group>
    <ActionBar.Divider />
    <ActionBar.Group>
      <ActionBar.IconButton icon={FileAddedIcon} aria-label="File Added"></ActionBar.IconButton>
      <ActionBar.IconButton icon={SearchIcon} aria-label="Search"></ActionBar.IconButton>
    </ActionBar.Group>
    <ActionBar.Group>
      <ActionBar.IconButton icon={ListUnorderedIcon} aria-label="Unordered List"></ActionBar.IconButton>
      <ActionBar.IconButton icon={ListOrderedIcon} aria-label="Ordered List"></ActionBar.IconButton>
    </ActionBar.Group>
    <ActionBar.IconButton icon={TasklistIcon} aria-label="Task List"></ActionBar.IconButton>
    <ActionBar.IconButton icon={ReplyIcon} aria-label="Saved Replies"></ActionBar.IconButton>
  </ActionBar>
)

export const TextLabels = () => (
  <ActionBar aria-label="Toolbar">
    <Button>Edit</Button>
    <Button>Duplicate</Button>
    <Button>Export to CSV</Button>
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

export const GapScale = () => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
    <div>
      <Text as="p" style={{marginBottom: 4}}>
        gap=&quot;none&quot;
      </Text>
      <ActionBar aria-label="Toolbar gap none" gap="none">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Bold" />
        <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic" />
        <ActionBar.IconButton icon={CodeIcon} aria-label="Code" />
      </ActionBar>
    </div>
    <div>
      <Text as="p" style={{marginBottom: 4}}>
        gap=&quot;condensed&quot; (default)
      </Text>
      <ActionBar aria-label="Toolbar gap condensed" gap="condensed">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Bold" />
        <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic" />
        <ActionBar.IconButton icon={CodeIcon} aria-label="Code" />
      </ActionBar>
    </div>
  </div>
)

export const WithDisabledItems = () => (
  <ActionBar aria-label="Toolbar">
    <ActionBar.IconButton icon={BoldIcon} aria-label="Bold"></ActionBar.IconButton>
    <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic"></ActionBar.IconButton>
    <ActionBar.IconButton icon={CodeIcon} aria-label="Code"></ActionBar.IconButton>
    <ActionBar.IconButton icon={LinkIcon} aria-label="Link"></ActionBar.IconButton>
    <ActionBar.Divider />
    <ActionBar.IconButton disabled icon={FileAddedIcon} aria-label="File Added"></ActionBar.IconButton>
    <ActionBar.IconButton disabled icon={SearchIcon} aria-label="Search"></ActionBar.IconButton>
    <ActionBar.IconButton disabled icon={QuoteIcon} aria-label="Insert Quote"></ActionBar.IconButton>
    <ActionBar.IconButton icon={ListUnorderedIcon} aria-label="Unordered List"></ActionBar.IconButton>
    <ActionBar.IconButton icon={ListOrderedIcon} aria-label="Ordered List"></ActionBar.IconButton>
    <ActionBar.IconButton icon={TasklistIcon} aria-label="Task List"></ActionBar.IconButton>
  </ActionBar>
)

type CommentBoxProps = {'aria-label': string}

export const CommentBox = (props: CommentBoxProps) => {
  const {'aria-label': ariaLabel} = props
  const [value, setValue] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)
  const buttonRef = React.useRef(null)
  const toolBarLabel = `${ariaLabel ? ariaLabel : 'Comment box'} toolbar`
  return (
    <div className={classes.CommentBoxContainer}>
      <header className={classes.CommentBoxHeader}>
        <div className={classes.CommentBoxHeaderLeft}>
          <ActionBar aria-label={toolBarLabel}>
            <ActionBar.IconButton icon={HeadingIcon} aria-label="Heading"></ActionBar.IconButton>
            <ActionBar.IconButton icon={BoldIcon} aria-label="Bold"></ActionBar.IconButton>
            <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic"></ActionBar.IconButton>
            <ActionBar.IconButton icon={CodeIcon} aria-label="Insert Code"></ActionBar.IconButton>
            <ActionBar.IconButton icon={LinkIcon} aria-label="Insert Link"></ActionBar.IconButton>
            <ActionBar.Divider />
            <ActionBar.IconButton icon={QuoteIcon} aria-label="Insert Quote"></ActionBar.IconButton>
            <ActionBar.IconButton icon={ListUnorderedIcon} aria-label="Unordered List"></ActionBar.IconButton>
            <ActionBar.IconButton icon={ListOrderedIcon} aria-label="Ordered List"></ActionBar.IconButton>
            <ActionBar.IconButton icon={TasklistIcon} aria-label="Task List"></ActionBar.IconButton>
            <ActionBar.IconButton
              ref={buttonRef}
              onClick={() => setIsOpen(true)}
              icon={ReplyIcon}
              aria-label="Saved Replies"
            ></ActionBar.IconButton>
          </ActionBar>
        </div>
        <div className={classes.CommentBoxHeaderRight}>
          <Button variant="invisible">Write</Button>
          <Button variant="invisible">Preview</Button>
        </div>
      </header>
      <Textarea value={value} onChange={e => setValue(e.target.value)} id="markdowninput" aria-label="Markdown value" />
      <Dialog aria-labelledby="header" returnFocusRef={buttonRef} isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <Dialog.Header id="header">Select a reply</Dialog.Header>
        <div className={classes.DialogContent}>Show saved replies</div>
        <Divider />
        <Button variant="invisible">Create your own saved reply</Button>
      </Dialog>
    </div>
  )
}

export const ActionBarWithMenuTrigger = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const buttonRef = React.useRef(null)

  return (
    <div>
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
        <div className={classes.DialogContent}>Show saved replies</div>
        <Divider />
        <Button variant="invisible">Create your own saved reply</Button>
      </Dialog>
    </div>
  )
}

export const ActionbarToggle = () => {
  const loginName = mockData.collaborators[1].login
  const [showEditView, setEditView] = React.useState(false)
  const [description /*, setDescription*/] = React.useState('')
  const anchorRef = React.useRef(null)
  return (
    <div className={classes.ActionBarToggleContainer}>
      <div className={classes.ActionBarToggleTop}>
        <div>
          <Avatar src={`https://github.com/${loginName}.png`} size={30} />
          <Text as="strong" className={classes.ActionBarToggleUser}>
            {loginName}
          </Text>
          <Text>opened this issue 2 hours ago</Text>
        </div>
        <div>
          <ActionMenu>
            <ActionMenu.Anchor ref={anchorRef}>
              <IconButton icon={ThreeBarsIcon} aria-label="Open Menu" />
            </ActionMenu.Anchor>
            <ActionMenu.Overlay>
              <ActionList>
                <ActionList.Item>
                  <ActionList.LeadingVisual>
                    <LinkIcon />
                  </ActionList.LeadingVisual>
                  Copy Link
                </ActionList.Item>
                <ActionList.Item>
                  <ActionList.LeadingVisual>
                    <QuoteIcon />
                  </ActionList.LeadingVisual>
                  Quote reply
                </ActionList.Item>
                <ActionList.Divider />
                <ActionList.Item onSelect={() => setEditView(true)}>
                  <ActionList.LeadingVisual>
                    <PencilIcon />
                  </ActionList.LeadingVisual>
                  Edit
                </ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        </div>
      </div>
      <div className={classes.ActionBarToggleBottom}>
        {showEditView ? (
          <div>
            <CommentBox aria-label="Comment box" />
            <div className={classes.ActionBarToggleButtons}>
              <Button
                variant="primary"
                onClick={() => {
                  setEditView(false)
                }}
              >
                Save
              </Button>
              <Button variant="danger" onClick={() => setEditView(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>{description ? description : 'No description Provided'}</div>
        )}
      </div>
    </div>
  )
}

export const MultipleActionBars = () => {
  const [showFirstCommentBox, setShowFirstCommentBox] = React.useState(false)
  const [showSecondCommentBox, setShowSecondCommentBox] = React.useState(false)
  return (
    <div>
      <div className={classes.MultipleActionBarsSection}>
        {showFirstCommentBox ? (
          <div>
            <CommentBox aria-label="First Comment Box" />
            <div className={classes.ActionBarToggleButtons}>
              <Button
                variant="primary"
                onClick={() => {
                  setShowFirstCommentBox(false)
                }}
              >
                Save
              </Button>
              <Button variant="danger" onClick={() => setShowFirstCommentBox(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => setShowFirstCommentBox(true)}>Show first commentBox</Button>
        )}
      </div>
      <div className={classes.MultipleActionBarsSection}>
        {showSecondCommentBox ? (
          <div>
            <CommentBox aria-label="Second Comment Box" />
            <div className={classes.ActionBarToggleButtons}>
              <Button
                variant="primary"
                onClick={() => {
                  setShowSecondCommentBox(false)
                }}
              >
                Save
              </Button>
              <Button variant="danger" onClick={() => setShowSecondCommentBox(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => setShowSecondCommentBox(true)}>Show second commentBox</Button>
        )}
      </div>
    </div>
  )
}

const ActionMenuExample = () => {
  return (
    <ActionBar.Menu
      aria-label="File options"
      icon={NoteIcon}
      items={[
        {label: 'Download', onClick: () => alert('Download clicked')},
        {label: 'Jump to line', onClick: () => alert('Jump to line clicked')},
        {label: 'Find in file', onClick: () => alert('Find in file clicked')},
        {label: 'Copy path', onClick: () => alert('Copy path clicked')},
        {label: 'Copy permalink', onClick: () => alert('Copy permalink clicked')},
        {type: 'divider'},
        {
          label: 'Delete file',
          onClick: () => alert('Delete file clicked'),
          leadingVisual: TrashIcon,
          variant: 'danger',
        },
      ]}
    />
  )
}

const menuHeadings: ActionBarMenuItem = {
  label: 'Headings',
  items: [
    {label: 'Heading 1', onClick: () => alert('Heading 1 clicked'), trailingVisual: '⌘ 1'},
    {label: 'Heading 2', onClick: () => alert('Heading 2 clicked'), trailingVisual: '⌘ 2'},
    {label: 'Heading 3', onClick: () => alert('Heading 3 clicked'), trailingVisual: '⌘ 3'},
    {label: 'Heading 4', onClick: () => alert('Heading 4 clicked'), trailingVisual: '⌘ 4'},
    {label: 'Heading 5', onClick: () => alert('Heading 5 clicked'), trailingVisual: '⌘ 5'},
    {label: 'Heading 6', onClick: () => alert('Heading 6 clicked'), trailingVisual: '⌘ 6'},
    {type: 'divider'},
    {label: 'Remove heading', onClick: () => alert('Remove heading clicked'), disabled: true},
  ],
}

export const WithMenus = () => (
  <ActionBar aria-label="Toolbar">
    <ActionBar.IconButton icon={ItalicIcon} aria-label="Italic"></ActionBar.IconButton>
    <ActionBar.IconButton icon={CodeIcon} aria-label="Code"></ActionBar.IconButton>
    <ActionBar.IconButton icon={LinkIcon} aria-label="Link"></ActionBar.IconButton>
    <ActionBar.Divider />
    <ActionBar.IconButton icon={FileAddedIcon} aria-label="File Added"></ActionBar.IconButton>
    <ActionBar.IconButton icon={SearchIcon} aria-label="Search"></ActionBar.IconButton>

    <ActionBar.IconButton disabled icon={FileAddedIcon} aria-label="File Added"></ActionBar.IconButton>
    <ActionBar.IconButton disabled icon={SearchIcon} aria-label="Search"></ActionBar.IconButton>
    <ActionBar.IconButton disabled icon={QuoteIcon} aria-label="Insert Quote"></ActionBar.IconButton>
    <ActionBar.IconButton icon={ListUnorderedIcon} aria-label="Unordered List"></ActionBar.IconButton>
    <ActionBar.IconButton icon={ListOrderedIcon} aria-label="Ordered List"></ActionBar.IconButton>
    <ActionMenuExample />
    <ActionBar.IconButton icon={TasklistIcon} aria-label="Task List"></ActionBar.IconButton>
    <ActionBar.Menu
      aria-label="Formatting"
      icon={KebabHorizontalIcon}
      overflowIcon="none"
      items={[
        {label: 'Bold', onClick: () => alert('Bold clicked')},
        {label: 'Underline', onClick: () => alert('Underline clicked')},
        menuHeadings,
      ]}
    />
  </ActionBar>
)
