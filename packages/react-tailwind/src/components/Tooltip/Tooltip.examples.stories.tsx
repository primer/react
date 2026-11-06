import {CheckIcon, GitBranchIcon, KebabHorizontalIcon, TriangleDownIcon, XIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {ActionMenu} from '../ActionMenu'
import {Breadcrumbs} from '../Breadcrumbs'
import {Button} from '../Button'
import {Dialog} from '../Dialog'
import {IconButton} from '../IconButton'
import {PageHeader} from '../PageHeader'
import {Tooltip} from './Tooltip'

const meta = {
  title: 'React Tailwind/Components/Tooltip/Examples',
  component: Tooltip,
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

// A label tooltip names its trigger with its `id`, so other elements can reference the same id.
export const CustomId: Story = {
  render: () => (
    <Tooltip id="tooltip-custom-id" type="label">
      <Tooltip.Trigger
        aria-labelledby="tooltip-custom-id"
        render={<IconButton aria-label="Close feedback form" icon={XIcon} variant="invisible" />}
      />
      <Tooltip.Content align="end" side="top">
        Close feedback form
      </Tooltip.Content>
    </Tooltip>
  ),
}

function FileActionsMenu() {
  return (
    <ActionMenu>
      <ActionMenu.Trigger
        render={<IconButton size="small" aria-label="More file actions" icon={KebabHorizontalIcon} />}
      />
      <ActionMenu.Content width="medium">
        <ActionMenu.Group>
          <ActionMenu.GroupLabel>Raw file content</ActionMenu.GroupLabel>
          <ActionMenu.Item>Download</ActionMenu.Item>
        </ActionMenu.Group>
        <ActionMenu.Divider />
        <ActionMenu.Item>
          Jump to line
          <ActionMenu.TrailingVisual>L</ActionMenu.TrailingVisual>
        </ActionMenu.Item>
        <ActionMenu.Divider />
        <ActionMenu.Item>
          Copy path
          <ActionMenu.TrailingVisual>⌘⇧.</ActionMenu.TrailingVisual>
        </ActionMenu.Item>
        <ActionMenu.Item>
          Copy permalink
          <ActionMenu.TrailingVisual>⌘⇧,</ActionMenu.TrailingVisual>
        </ActionMenu.Item>
        <ActionMenu.Divider />
        <ActionMenu.Group>
          <ActionMenu.GroupLabel>View Options</ActionMenu.GroupLabel>
          <ActionMenu.Item>Show code folding buttons</ActionMenu.Item>
          <ActionMenu.Item>Wrap lines</ActionMenu.Item>
          <ActionMenu.Item>Center content</ActionMenu.Item>
        </ActionMenu.Group>
        <ActionMenu.Divider />
        <ActionMenu.Item variant="danger">
          Delete file
          <ActionMenu.TrailingVisual>⌘D</ActionMenu.TrailingVisual>
        </ActionMenu.Item>
      </ActionMenu.Content>
    </ActionMenu>
  )
}

export const FilesPage: Story = {
  render: () => (
    <PageHeader role="banner" aria-label="Banner">
      <PageHeader.ContextArea>
        <PageHeader.ParentLink>Files</PageHeader.ParentLink>
        <PageHeader.ContextAreaActions>
          <ActionMenu>
            <Tooltip>
              <Tooltip.Trigger
                render={
                  <ActionMenu.Trigger
                    render={
                      <Button size="small" leadingVisual={GitBranchIcon} trailingAction={TriangleDownIcon}>
                        main
                      </Button>
                    }
                  />
                }
              />
              <Tooltip.Content>Supplementary text to add here</Tooltip.Content>
            </Tooltip>
            <ActionMenu.Content width="medium">
              <ActionMenu.Item>
                <ActionMenu.LeadingVisual>
                  <CheckIcon />
                </ActionMenu.LeadingVisual>
                main <ActionMenu.TrailingVisual>default</ActionMenu.TrailingVisual>
              </ActionMenu.Item>
              <ActionMenu.Item>branch-1</ActionMenu.Item>
              <ActionMenu.Item>branch-2</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu>
          <FileActionsMenu />
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
        <h2 className="sr-only">PageHeader.tsx</h2>
        <PageHeader.Actions hidden={{narrow: true}}>
          <FileActionsMenu />
        </PageHeader.Actions>
      </PageHeader.TitleArea>
    </PageHeader>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'small',
    },
  },
}

// The tooltip composes with the dialog trigger by rendering it. Focus returns to the trigger on close, but the tooltip
// only reopens for keyboard focus.
export const DialogTrigger: Story = {
  render: function DialogTriggerStory() {
    const [secondOpen, setSecondOpen] = useState(false)
    return (
      <Dialog>
        <Tooltip>
          <Tooltip.Trigger render={<Dialog.Trigger render={<IconButton icon={CheckIcon} aria-label="Merge" />} />} />
          <Tooltip.Content>Ready to merge</Tooltip.Content>
        </Tooltip>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>My Dialog</Dialog.Title>
            <Dialog.CloseButton />
          </Dialog.Header>
          <Dialog.Body>
            The icon button that triggers the dialog, takes the focus back when the dialog is closed however the tooltip
            is not shown again if the dialog is closed with a mouse. Because the tooltip is shown only on focus-visible.
          </Dialog.Body>
          <Dialog.Footer>
            <Button onClick={() => setSecondOpen(true)}>Open Second Dialog</Button>
            <Dialog.Close render={<Button variant="danger">Delete the universe</Button>} />
            <Button variant="primary" onClick={() => setSecondOpen(true)}>
              Proceed
            </Button>
          </Dialog.Footer>
          <Dialog open={secondOpen} onOpenChange={setSecondOpen}>
            <Dialog.Content width="small">
              <Dialog.Header>
                <Dialog.Title>Inner dialog!</Dialog.Title>
                <Dialog.CloseButton />
              </Dialog.Header>
              <Dialog.Body>Hello world</Dialog.Body>
            </Dialog.Content>
          </Dialog>
        </Dialog.Content>
      </Dialog>
    )
  },
}

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

// A long delay keeps tooltips from flashing while the pointer crosses a grid of familiar icons, as in emoji reactions.
export const EmojiPicker: Story = {
  render: () => (
    <div className="grid max-w-[200px] grid-cols-[repeat(5,1fr)] gap-1 p-4">
      {emojis.map(({emoji, name}) => (
        <Tooltip key={name} delay="long">
          <Tooltip.Trigger
            render={
              <Button
                aria-label={name}
                variant="invisible"
                size="small"
                className="flex min-h-8 min-w-8 items-center justify-center p-2 text-[18px]"
              >
                {emoji}
              </Button>
            }
          />
          <Tooltip.Content side="top">{name}</Tooltip.Content>
        </Tooltip>
      ))}
    </div>
  ),
}
