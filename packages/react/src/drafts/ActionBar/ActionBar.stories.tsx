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
  HeadingIcon,
  QuoteIcon,
  ListUnorderedIcon,
  ListOrderedIcon,
  TasklistIcon,
  ReplyIcon,
} from '@primer/octicons-react'
import {MarkdownInput} from '../MarkdownEditor/_MarkdownInput'
import {ViewSwitch} from '../MarkdownEditor/_ViewSwitch'
import type {MarkdownViewMode} from '../MarkdownEditor/_ViewSwitch'
import {Box, Dialog, Button} from '../..'
import {Divider} from '../../deprecated/ActionList/Divider'

export default {
  title: 'Drafts/Components/ActionBar',
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
    <ActionBar.IconButton icon={FileAddedIcon} aria-label="Default"></ActionBar.IconButton>
    <ActionBar.IconButton icon={SearchIcon} aria-label="Default"></ActionBar.IconButton>
    <ActionBar.IconButton icon={FileAddedIcon} aria-label="Default"></ActionBar.IconButton>
    <ActionBar.IconButton icon={SearchIcon} aria-label="Default"></ActionBar.IconButton>
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

export const CommentBox = () => {
  const [view, setView] = React.useState<MarkdownViewMode>('edit')
  const loadPreview = React.useCallback(() => {
    //console.log('loadPreview')
  }, [])
  const [value, setValue] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)
  const buttonRef = React.useRef(null)
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
          <ActionBar>
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
      <ActionBar>
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
