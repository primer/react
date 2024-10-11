import React from 'react'
import type {Meta} from '@storybook/react'
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
} from '@primer/octicons-react'
import {Box, Button, Avatar, ActionMenu, IconButton, ActionList, Textarea} from '../'
import {Dialog} from '../DialogV1'
import {Divider} from '../deprecated/ActionList/Divider'
import mockData from '../experimental/SelectPanel2/mock-story-data'

import styles from './ActionBar.stories.module.css'

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

type CommentBoxProps = {'aria-label': string}

export const CommentBox = (props: CommentBoxProps) => {
  const {'aria-label': ariaLabel} = props
  const [value, setValue] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)
  const buttonRef = React.useRef(null)
  const toolBarLabel = `${ariaLabel ? ariaLabel : 'Comment box'} toolbar`
  return (
    <Box className={styles.Box_0}>
      <Box as="header" className={styles.Box_1}>
        <Box className={styles.Box_2}>
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
        </Box>
      </Box>
      <Textarea value={value} onChange={e => setValue(e.target.value)} id="markdowninput" aria-label="Markdown value" />
      <Dialog aria-labelledby="header" returnFocusRef={buttonRef} isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <Dialog.Header id="header">Select a reply</Dialog.Header>
        <Box p={3}>Show saved replies</Box>
        <Divider />
        <Button variant="invisible">Create your own saved reply</Button>
      </Dialog>
    </Box>
  )
}

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

export const ActionbarToggle = () => {
  const loginName = mockData.collaborators[1].login
  const [showEditView, setEditView] = React.useState(false)
  const [description /*, setDescription*/] = React.useState('')
  const anchorRef = React.useRef(null)
  return (
    <Box className={styles.Box_3}>
      <Box className={styles.Box_4}>
        <Box>
          <Avatar src={`https://github.com/${loginName}.png`} size={30} />
          <Text as="strong" className={styles.Text_0}>
            {loginName}
          </Text>
          <Text>opened this issue 2 hours ago</Text>
        </Box>
        <Box>
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
                <ActionList.Item onClick={() => setEditView(true)}>
                  <ActionList.LeadingVisual>
                    <PencilIcon />
                  </ActionList.LeadingVisual>
                  Edit
                </ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        </Box>
      </Box>
      <Box className={styles.Box_5}>
        {showEditView ? (
          <Box>
            <CommentBox aria-label="Comment box" />
            <Box className={styles.Box_6}>
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
            </Box>
          </Box>
        ) : (
          <Box>{description ? description : 'No description Provided'}</Box>
        )}
      </Box>
    </Box>
  )
}

export const MultipleActionBars = () => {
  const [showFirstCommentBox, setShowFirstCommentBox] = React.useState(false)
  const [showSecondCommentBox, setShowSecondCommentBox] = React.useState(false)
  return (
    <Box>
      <Box className={styles.Box_5}>
        {showFirstCommentBox ? (
          <Box>
            <CommentBox aria-label="First Comment Box" />
            <Box className={styles.Box_6}>
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
            </Box>
          </Box>
        ) : (
          <Button onClick={() => setShowFirstCommentBox(true)}>Show first commentBox</Button>
        )}
      </Box>
      <Box className={styles.Box_5}>
        {showSecondCommentBox ? (
          <Box>
            <CommentBox aria-label="Second Comment Box" />
            <Box className={styles.Box_6}>
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
            </Box>
          </Box>
        ) : (
          <Button onClick={() => setShowSecondCommentBox(true)}>Show second commentBox</Button>
        )}
      </Box>
    </Box>
  )
}
