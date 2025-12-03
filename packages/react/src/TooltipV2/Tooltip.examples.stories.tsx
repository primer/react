import {useState, useCallback, useRef} from 'react'
import {Button, IconButton, Breadcrumbs, ActionMenu, ActionList} from '..'
import {PageHeader} from '../PageHeader'
import {Tooltip} from './Tooltip'
import {Dialog} from '../experimental'
import {GitBranchIcon, KebabHorizontalIcon, TriangleDownIcon, CheckIcon, XIcon} from '@primer/octicons-react'
import {default as VisuallyHidden} from '../_VisuallyHidden'

export default {
  title: 'Components/TooltipV2/Examples',
  component: Tooltip,
}

export const CustomId = () => (
  <Tooltip id="tooltip-custom-id" text="Close feedback form" direction="nw" type="label">
    <IconButton aria-labelledby="tooltip-custom-id" icon={XIcon} variant="invisible" onClick={() => {}} />
  </Tooltip>
)

export const FilesPage = () => (
  <PageHeader role="banner" aria-label="Banner">
    <PageHeader.ContextArea>
      <PageHeader.ParentLink>Files</PageHeader.ParentLink>
      <PageHeader.ContextAreaActions>
        <ActionMenu>
          <ActionMenu.Anchor>
            <Tooltip text="Supplementary text to add here">
              <Button size="small" leadingVisual={GitBranchIcon} trailingAction={TriangleDownIcon}>
                main
              </Button>
            </Tooltip>
          </ActionMenu.Anchor>
          <ActionMenu.Overlay width="medium">
            <ActionList>
              <ActionList.Item onSelect={() => alert('Main')}>
                <ActionList.LeadingVisual>
                  <CheckIcon />
                </ActionList.LeadingVisual>
                main <ActionList.TrailingVisual>default</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Item onSelect={() => alert('Branch 1')}>branch-1</ActionList.Item>
              <ActionList.Item onSelect={() => alert('Branch 2')}>branch-2</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
        <ActionMenu>
          <ActionMenu.Anchor>
            <IconButton size="small" aria-label="More file actions" icon={KebabHorizontalIcon} />
          </ActionMenu.Anchor>
          <ActionMenu.Overlay width="medium">
            <ActionList>
              <ActionList.Group>
                <ActionList.GroupHeading>Raw file content</ActionList.GroupHeading>
                <ActionList.Item onSelect={() => alert('Download')}>Download</ActionList.Item>
              </ActionList.Group>
              <ActionList.Divider />
              <ActionList.Item onSelect={() => alert('Jump to line')}>
                Jump to line
                <ActionList.TrailingVisual>L</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Divider />
              <ActionList.Item onSelect={() => alert('Copy path')}>
                Copy path
                <ActionList.TrailingVisual>⌘⇧.</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Item onSelect={() => alert('Copy permalink')}>
                Copy permalink
                <ActionList.TrailingVisual>⌘⇧,</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Divider />
              <ActionList.Group>
                <ActionList.GroupHeading>View Options</ActionList.GroupHeading>
                <ActionList.Item onSelect={() => alert('Show code folding buttons')}>
                  Show code folding buttons
                </ActionList.Item>
                <ActionList.Item onSelect={() => alert('Wrap lines')}>Wrap lines</ActionList.Item>
                <ActionList.Item onSelect={() => alert('Center content')}>Center content</ActionList.Item>
              </ActionList.Group>
              <ActionList.Divider />
              <ActionList.Item variant="danger" onSelect={() => alert('Delete file clicked')}>
                Delete file
                <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
              </ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      </PageHeader.ContextAreaActions>
    </PageHeader.ContextArea>
    <PageHeader.TitleArea>
      <Breadcrumbs>
        <Breadcrumbs.Item href="https://github.com/primer/react/tree/main">react</Breadcrumbs.Item>
        <Breadcrumbs.Item href="https://github.com/primer/react/tree/main/packages/react/src">src</Breadcrumbs.Item>
        <Breadcrumbs.Item href="https://github.com/primer/react/tree/main/packages/react/src/PageHeader">
          PageHeader
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="https://github.com/primer/react/tree/main/packages/react/src/PageHeader/PageHeader.tsx">
          PageHeader.tsx
        </Breadcrumbs.Item>
      </Breadcrumbs>
      <VisuallyHidden as="h2">PageHeader.tsx</VisuallyHidden>
      <PageHeader.Actions hidden={{narrow: true}}>
        <ActionMenu>
          <ActionMenu.Anchor>
            <IconButton size="small" aria-label="More file actions" icon={KebabHorizontalIcon} />
          </ActionMenu.Anchor>
          <ActionMenu.Overlay width="medium">
            <ActionList>
              <ActionList.Group>
                <ActionList.GroupHeading>Raw file content</ActionList.GroupHeading>
                <ActionList.Item onSelect={() => alert('Download')}>Download</ActionList.Item>
              </ActionList.Group>
              <ActionList.Divider />
              <ActionList.Item onSelect={() => alert('Jump to line')}>
                Jump to line
                <ActionList.TrailingVisual>L</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Divider />
              <ActionList.Item onSelect={() => alert('Copy path')}>
                Copy path
                <ActionList.TrailingVisual>⌘⇧.</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Item onSelect={() => alert('Copy permalink')}>
                Copy permalink
                <ActionList.TrailingVisual>⌘⇧,</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Divider />
              <ActionList.Group>
                <ActionList.GroupHeading>View Options</ActionList.GroupHeading>
                <ActionList.Item onSelect={() => alert('Show code folding buttons')}>
                  Show code folding buttons
                </ActionList.Item>
                <ActionList.Item onSelect={() => alert('Wrap lines')}>Wrap lines</ActionList.Item>
                <ActionList.Item onSelect={() => alert('Center content')}>Center content</ActionList.Item>
              </ActionList.Group>
              <ActionList.Divider />
              <ActionList.Item variant="danger" onSelect={() => alert('Delete file clicked')}>
                Delete file
                <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
              </ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      </PageHeader.Actions>
    </PageHeader.TitleArea>
  </PageHeader>
)

FilesPage.parameters = {
  viewport: {
    defaultViewport: 'small',
  },
}

export const DialogTrigger = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [secondOpen, setSecondOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const onDialogClose = useCallback(() => setIsOpen(false), [])
  const onSecondDialogClose = useCallback(() => setSecondOpen(false), [])
  const openSecondDialog = useCallback(() => setSecondOpen(true), [])
  return (
    <>
      <Tooltip text="Ready to merge">
        <IconButton ref={buttonRef} onClick={() => setIsOpen(!isOpen)} icon={CheckIcon} aria-label="Merge" />
      </Tooltip>
      {isOpen && (
        <Dialog
          title="My Dialog"
          onClose={onDialogClose}
          footerButtons={[
            {buttonType: 'default', content: 'Open Second Dialog', onClick: openSecondDialog},
            {buttonType: 'danger', content: 'Delete the universe', onClick: onDialogClose},
            {buttonType: 'primary', content: 'Proceed', onClick: openSecondDialog},
          ]}
        >
          The icon button that triggers the dialog, takes the focus back when the dialog is closed however the tooltip
          is not shown again if the dialog is closed with a mouse. Because the tooltip is shown only on focus-visible.
          {secondOpen && (
            <Dialog title="Inner dialog!" onClose={onSecondDialogClose} width="small">
              Hello world
            </Dialog>
          )}
        </Dialog>
      )}
    </>
  )
}

export const EmojiPicker = () => {
  // This example demonstrates a grid of emojis/icons with tooltips that appear after a long delay.
  // This pattern is used in places like emoji reactions on comments and the icon picker in the issues dashboard's saved views on GitHub.
  // The delay improves UX by preventing distraction when users move their cursor across multiple emojis/icons,
  // especially since these icons are generally familiar and don't require immediate explanation.

  const emojis = [
    {emoji: '😀', name: 'Grinning Face'},
    {emoji: '😍', name: 'Heart Eyes'},
    {emoji: '🎉', name: 'Party Popper'},
    {emoji: '👍', name: 'Thumbs Up'},
    {emoji: '❤️', name: 'Red Heart'},
    {emoji: '🔥', name: 'Fire'},
    {emoji: '💯', name: 'Hundred Points'},
    {emoji: '🚀', name: 'Rocket'},
    {emoji: '⭐', name: 'Star'},
    {emoji: '🎯', name: 'Direct Hit'},
    {emoji: '💡', name: 'Light Bulb'},
    {emoji: '🌟', name: 'Glowing Star'},
    {emoji: '🎊', name: 'Confetti Ball'},
    {emoji: '✨', name: 'Sparkles'},
    {emoji: '🌈', name: 'Rainbow'},
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '4px',
        maxWidth: '200px',
        padding: '16px',
      }}
    >
      {emojis.map((emojiItem, index) => (
        <Tooltip key={index} text={emojiItem.name} direction="n" delay="long">
          <Button
            aria-label={emojiItem.name}
            variant="invisible"
            size="small"
            style={{
              fontSize: '18px',
              padding: '8px',
              minWidth: '32px',
              minHeight: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {emojiItem.emoji}
          </Button>
        </Tooltip>
      ))}
    </div>
  )
}
