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
import {MarkdownInput} from '../drafts/MarkdownEditor/_MarkdownInput'
import {ViewSwitch} from '../drafts/MarkdownEditor/_ViewSwitch'
import type {MarkdownViewMode} from '../drafts/MarkdownEditor/_ViewSwitch'
import {Box, Dialog, Button, Avatar, ActionMenu, IconButton, ActionList} from '../'
import {Divider} from '../deprecated/ActionList/Divider'
import mockData from '../drafts/SelectPanel2/mock-story-data'

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

type CommentBoxProps = {'aria-label': string}

export const CommentBox = (props: CommentBoxProps) => {
  const {'aria-label': ariaLabel} = props
  const [view, setView] = React.useState<MarkdownViewMode>('edit')
  const loadPreview = React.useCallback(() => {
    //console.log('loadPreview')
  }, [])
  const [value, setValue] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)
  const buttonRef = React.useRef(null)
  const toolBarLabel = `${ariaLabel ? ariaLabel : 'Comment box'} toolbar`
  return (
    <Box
      sx={{
        maxWidth: 800,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderColor: 'border.default',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 2,
        minInlineSize: 'auto',
        bg: 'canvas.default',
        color: 'fg.default',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: 'canvas.subtle',
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
          justifyContent: 'space-between',
        }}
        as="header"
      >
        <Box sx={{width: '50%'}}>
          <ViewSwitch
            selectedView={view}
            onViewSelect={setView}
            //disabled={fileHandler?.uploadProgress !== undefined}
            onLoadPreview={loadPreview}
          />
        </Box>
        <Box sx={{width: '50%'}}>
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
      <MarkdownInput
        value={value}
        visible={view === 'edit'}
        onChange={e => {
          setValue(e.target.value)
        }}
        id={'markdowninput'}
        isDraggedOver={false}
        minHeightLines={5}
        maxHeightLines={35}
        monospace={false}
        pasteUrlsAsPlainText={false}
      />
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
  const descriptionStyles = {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'border.default',
    p: 3,
  }
  const topSectionStyles = {
    bg: 'canvas.subtle',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: 'border.default',
    p: 3,
  }
  const bottomSectionStyles = {
    p: 3,
  }
  const loginName = mockData.collaborators[1].login
  const [showEditView, setEditView] = React.useState(false)
  const [description /*, setDescription*/] = React.useState('')
  const anchorRef = React.useRef(null)
  return (
    <Box sx={descriptionStyles}>
      <Box sx={topSectionStyles}>
        <Box>
          <Avatar src={`https://github.com/${loginName}.png`} size={30} />
          <Text as="strong" sx={{marginLeft: 2, marginRight: 2}}>
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
      <Box sx={bottomSectionStyles}>
        {showEditView ? (
          <Box>
            <CommentBox aria-label="Comment box" />
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', p: 2, gap: 2}}>
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
      <Box sx={{p: 3}}>
        {showFirstCommentBox ? (
          <Box>
            <CommentBox aria-label="First Comment Box" />
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', p: 2, gap: 2}}>
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
      <Box sx={{p: 3}}>
        {showSecondCommentBox ? (
          <Box>
            <CommentBox aria-label="Second Comment Box" />
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', p: 2, gap: 2}}>
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
