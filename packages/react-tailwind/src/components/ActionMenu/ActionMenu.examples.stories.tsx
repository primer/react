import React from 'react'
import {flushSync} from 'react-dom'
import {expect, userEvent, within} from 'storybook/test'
import {
  ArchiveIcon,
  BookIcon,
  CalendarIcon,
  CheckIcon,
  CopyIcon,
  GearIcon,
  IssueOpenedIcon,
  KebabHorizontalIcon,
  MilestoneIcon,
  NumberIcon,
  PeopleIcon,
  TableIcon,
  TypographyIcon,
  WorkflowIcon,
  XIcon,
} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {Button} from '../Button'
import {Dialog} from '../Dialog'
import {FormControl} from '../FormControl'
import {IconButton} from '../IconButton'
import {TextInput} from '../TextInput'
import {ActionMenu, type ActionMenuContentProps} from './ActionMenu'
import {CommentActions, GitHubProjectsGroup, ProjectActions} from './ActionMenu.storyHelpers'

const meta = {
  title: 'React Tailwind/Components/ActionMenu/Examples',
  component: ActionMenu,
} satisfies Meta<typeof ActionMenu>

export default meta
type Story = StoryObj<typeof meta>

const notifyClicked = (name: string) => alert(`${name} clicked`)

const milestones = [
  {name: 'FY21 - Q2', due: 'December 31, 2021'},
  {name: 'FY22 - Q3', due: 'March 31, 2022'},
  {name: 'FY23 - Q1', due: 'June 30, 2022'},
  {name: 'FY23 - Q2', due: 'December 30, 2022'},
]

function MilestoneItems({closed}: {closed: boolean}) {
  return milestones
    .filter(milestone => milestone.name.includes('21') === closed)
    .map(milestone => (
      <ActionMenu.RadioItem key={milestone.name} value={milestone.name}>
        <ActionMenu.LeadingVisual>
          <MilestoneIcon />
        </ActionMenu.LeadingVisual>
        {milestone.name}
        <ActionMenu.Description variant="block">Due by {milestone.due}</ActionMenu.Description>
      </ActionMenu.RadioItem>
    ))
}

export const GroupsAndDescriptions: Story = {
  render: function GroupsAndDescriptionsExample() {
    const [selectedMilestone, setSelectedMilestone] = React.useState<string>(milestones[2].name)

    return (
      <ActionMenu open>
        <ActionMenu.Button variant="default">
          <span className="inline-block text-muted">Milestone:</span> {selectedMilestone}
        </ActionMenu.Button>
        <ActionMenu.Content width="medium" showDividers>
          <ActionMenu.RadioGroup value={selectedMilestone} onValueChange={setSelectedMilestone}>
            <ActionMenu.GroupLabel>Open</ActionMenu.GroupLabel>
            <MilestoneItems closed={false} />
          </ActionMenu.RadioGroup>
          <ActionMenu.RadioGroup value={selectedMilestone} onValueChange={setSelectedMilestone}>
            <ActionMenu.GroupLabel>Closed</ActionMenu.GroupLabel>
            <MilestoneItems closed />
          </ActionMenu.RadioGroup>
        </ActionMenu.Content>
      </ActionMenu>
    )
  },
}

const overlayOptions = ['Option 1', ...Array.from({length: 7}, () => 'Option 2')]

function OverlayOptionsMenu({variant}: Pick<ActionMenuContentProps, 'variant'>) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex justify-center">
      <ActionMenu open={open} onOpenChange={setOpen}>
        <ActionMenu.Button>Menu</ActionMenu.Button>
        <ActionMenu.Content width="large" align="center" variant={variant}>
          {overlayOptions.map((option, index) => (
            // Options repeat, so their position is their only stable identity.
            <ActionMenu.Item key={index}>{option}</ActionMenu.Item>
          ))}
        </ActionMenu.Content>
      </ActionMenu>
    </div>
  )
}

export const CustomOverlayProps: Story = {
  render: () => <OverlayOptionsMenu />,
}

export const FullScreen: Story = {
  render: () => <OverlayOptionsMenu variant={{regular: 'anchored', narrow: 'fullscreen'}} />,
}

export const ControlledMenu: Story = {
  render: function ControlledMenuExample() {
    const [actionFired, setActionFired] = React.useState('')
    const [open, setOpen] = React.useState(false)

    return (
      <>
        <h1>Controlled Menu</h1>
        <h2>External Open State: {open ? 'Open' : 'Closed'}</h2>
        <h2>Last option activated: {actionFired}</h2>
        <div>
          <Button onClick={() => setOpen(value => !value)}>{open ? 'Close Menu' : 'Open Menu'}</Button>
        </div>
        <br />
        {/* The open state is controlled externally, but the menu still anchors to its own trigger. */}
        <ActionMenu open={open} onOpenChange={setOpen}>
          <ActionMenu.Button>Anchor</ActionMenu.Button>
          <ActionMenu.Content>
            <CommentActions onAction={setActionFired} />
          </ActionMenu.Content>
        </ActionMenu>
      </>
    )
  },
}

export const ShortcutMenu: Story = {
  render: function ShortcutMenuExample() {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.shiftKey && event.key.toLowerCase() === 'c') setOpen(true)
      }
      window.addEventListener('keydown', onKeyDown)
      return () => window.removeEventListener('keydown', onKeyDown)
    }, [])

    return (
      <>
        <h1>Shortcut Menu</h1>
        <h2>External Open State: {open ? 'Open' : 'Closed'}</h2>
        <h2>Press Shift+C to open the menu</h2>
        <br />
        {/* Demonstrates how mouse and keyboard modality affect `:focus-visible` styles in the menu. */}
        <FormControl>
          <FormControl.Label>Default label</FormControl.Label>
          <TextInput />
        </FormControl>
        <ActionMenu open={open} onOpenChange={setOpen}>
          <ActionMenu.Button className="invisible">Anchor</ActionMenu.Button>
          <ActionMenu.Content>
            <CommentActions viewFile />
          </ActionMenu.Content>
        </ActionMenu>
      </>
    )
  },
}

function ListItemWithContextMenu({children}: {children: string}) {
  const [open, setOpen] = React.useState(false)
  const openMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    setOpen(true)
  }

  return (
    <li onContextMenu={openMenu}>
      <ActionMenu open={open} onOpenChange={setOpen}>
        <ActionMenu.Trigger render={<Button variant="invisible" />}>{children}</ActionMenu.Trigger>
        <ActionMenu.Content>
          <CommentActions viewFile />
        </ActionMenu.Content>
      </ActionMenu>
    </li>
  )
}

export const ContextMenu: Story = {
  render: () => (
    <>
      <div>Right click the list items below to see the context menu</div>
      <ul>
        <ListItemWithContextMenu>List item one</ListItemWithContextMenu>
        <ListItemWithContextMenu>List item two</ListItemWithContextMenu>
        <ListItemWithContextMenu>List item three</ListItemWithContextMenu>
      </ul>
    </>
  ),
}

export const CustomAnchor: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Trigger render={<IconButton icon={KebabHorizontalIcon} aria-label="Open menu" />} />
      <ActionMenu.Content width="medium">
        <CommentActions onAction={notifyClicked} />
      </ActionMenu.Content>
    </ActionMenu>
  ),
}

export const CustomAnchorId: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Trigger
        id="custom-anchor-id"
        render={<IconButton icon={KebabHorizontalIcon} aria-label="Open menu" />}
      />
      <ActionMenu.Content width="medium">
        <CommentActions onAction={notifyClicked} />
      </ActionMenu.Content>
    </ActionMenu>
  ),
}

const groupByOptions = [
  {text: 'Status', icon: IssueOpenedIcon},
  {text: 'Stage', icon: TableIcon},
  {text: 'Assignee', icon: PeopleIcon},
  {text: 'Team', icon: TypographyIcon},
  {text: 'Estimate', icon: NumberIcon},
  {text: 'Due Date', icon: CalendarIcon},
]

export const MixedSelection: Story = {
  render: function MixedSelectionExample() {
    const [groupBy, setGroupBy] = React.useState<string | null>(groupByOptions[1].text)
    const selectedOption = groupByOptions.find(option => option.text === groupBy)

    return (
      <ActionMenu>
        <ActionMenu.Button leadingVisual={selectedOption?.icon}>
          {selectedOption ? `Group by ${selectedOption.text}` : 'Group items by'}
        </ActionMenu.Button>
        <ActionMenu.Content width="medium">
          <ActionMenu.RadioGroup value={groupBy} onValueChange={setGroupBy}>
            <ActionMenu.GroupLabel>Group by</ActionMenu.GroupLabel>
            {groupByOptions.map(option => (
              <ActionMenu.RadioItem key={option.text} value={option.text}>
                <ActionMenu.LeadingVisual>
                  <option.icon />
                </ActionMenu.LeadingVisual>
                {option.text}
              </ActionMenu.RadioItem>
            ))}
          </ActionMenu.RadioGroup>
          {groupBy === null ? null : (
            <ActionMenu.Group>
              <ActionMenu.Divider />
              <ActionMenu.Item onClick={() => setGroupBy(null)}>
                <ActionMenu.LeadingVisual>
                  <XIcon />
                </ActionMenu.LeadingVisual>
                Clear Group by
              </ActionMenu.Item>
            </ActionMenu.Group>
          )}
        </ActionMenu.Content>
      </ActionMenu>
    )
  },
}

const viewOptions = ['Show code folding buttons', 'Wrap lines', 'Center content']

export const MultipleSections: Story = {
  render: function MultipleSectionsExample() {
    const [checked, setChecked] = React.useState<ReadonlySet<string>>(() => new Set([viewOptions[0]]))
    const toggle = (option: string, nextChecked: boolean) =>
      setChecked(current => {
        const next = new Set(current)
        if (nextChecked) next.add(option)
        else next.delete(option)
        return next
      })

    return (
      <ActionMenu open>
        <ActionMenu.Trigger render={<IconButton icon={KebabHorizontalIcon} aria-label="Open menu" />} />
        <ActionMenu.Content width="small">
          <ActionMenu.Group>
            <ActionMenu.GroupLabel>Raw file content</ActionMenu.GroupLabel>
            <ActionMenu.Item onClick={() => notifyClicked('Download')}>Download</ActionMenu.Item>
            <ActionMenu.Divider />
            <ActionMenu.Item onClick={() => notifyClicked('Jump to line')}>Jump to line</ActionMenu.Item>
            <ActionMenu.Item onClick={() => notifyClicked('Find in file')}>Find in file</ActionMenu.Item>
            <ActionMenu.Divider />
            <ActionMenu.Item onClick={() => notifyClicked('Copy path')}>Copy path</ActionMenu.Item>
            <ActionMenu.Item onClick={() => notifyClicked('Copy permalink')}>Copy permalink</ActionMenu.Item>
          </ActionMenu.Group>
          <ActionMenu.Divider />
          <ActionMenu.Group>
            <ActionMenu.GroupLabel>View options</ActionMenu.GroupLabel>
            {viewOptions.map(option => (
              <ActionMenu.CheckboxItem
                key={option}
                checked={checked.has(option)}
                onCheckedChange={nextChecked => toggle(option, nextChecked)}
              >
                {option}
              </ActionMenu.CheckboxItem>
            ))}
          </ActionMenu.Group>
          <ActionMenu.Divider />
          <ActionMenu.Group>
            <ActionMenu.GroupLabel>View options</ActionMenu.GroupLabel>
            <ActionMenu.Item variant="danger" onClick={() => notifyClicked('Delete file')}>
              Delete file
            </ActionMenu.Item>
          </ActionMenu.Group>
        </ActionMenu.Content>
      </ActionMenu>
    )
  },
}

export const DelayedMenuClose: Story = {
  render: function DelayedMenuCloseExample() {
    const [open, setOpen] = React.useState(false)
    const [copied, setCopied] = React.useState(false)

    const copyLink = () => {
      setCopied(true)
      setTimeout(() => {
        setOpen(false)
        setCopied(false)
      }, 700)
    }

    return (
      <>
        <h1>Delayed Menu Close</h1>
        <ActionMenu open={open} onOpenChange={setOpen}>
          <ActionMenu.Button>Anchor</ActionMenu.Button>
          <ActionMenu.Content>
            <ActionMenu.Item closeOnClick={false} onClick={copyLink}>
              <ActionMenu.LeadingVisual>{copied ? <CheckIcon /> : <CopyIcon />}</ActionMenu.LeadingVisual>
              {copied ? 'Copied!' : 'Copy link'}
            </ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
      </>
    )
  },
}

export const OnRightSide: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Open menu</ActionMenu.Button>
      <ActionMenu.Content width="medium" side="right">
        <CommentActions onAction={notifyClicked} />
      </ActionMenu.Content>
    </ActionMenu>
  ),
}

export const SettingMaxHeight: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Open menu</ActionMenu.Button>
      <ActionMenu.Content width="auto" maxHeight="large">
        {Array.from({length: 100}, (_, index) => (
          <ActionMenu.Item key={`item-${index}`} onClick={() => notifyClicked(`Item ${index + 1}`)}>
            Item {index + 1}
          </ActionMenu.Item>
        ))}
      </ActionMenu.Content>
    </ActionMenu>
  ),
}

const outageText = 'Unavailable due to an outage'

export const OnlyInactiveItems: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button inactive>Open menu</ActionMenu.Button>
      <ActionMenu.Content width="auto">
        <ProjectActions inactiveText={outageText} onAction={notifyClicked} />
        <GitHubProjectsGroup heading="Github projects" inactiveText={outageText} />
      </ActionMenu.Content>
    </ActionMenu>
  ),
}

const anchorSides: Array<{label: string; side: NonNullable<ActionMenuContentProps['side']>}> = [
  {label: 'Top', side: 'top'},
  {label: 'Bottom', side: 'bottom'},
  {label: 'Left', side: 'left'},
  {label: 'Right', side: 'right'},
  {label: 'Inline start', side: 'inline-start'},
  {label: 'Inline end', side: 'inline-end'},
]

export const DynamicAnchorSides: Story = {
  render: function DynamicAnchorSidesExample() {
    const [side, setSide] = React.useState<NonNullable<ActionMenuContentProps['side']>>('bottom')

    return (
      <div className="absolute top-1/2 left-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2">
        <ActionMenu>
          <ActionMenu.Button>Open menu</ActionMenu.Button>
          <ActionMenu.Content width="auto" maxHeight="large" side={side}>
            <ActionMenu.RadioGroup value={side} onValueChange={setSide}>
              <ActionMenu.GroupLabel>Side</ActionMenu.GroupLabel>
              {anchorSides.map(option => (
                <ActionMenu.RadioItem key={option.side} value={option.side}>
                  {option.label}
                </ActionMenu.RadioItem>
              ))}
            </ActionMenu.RadioGroup>
          </ActionMenu.Content>
        </ActionMenu>
        <span>Current Overlay Side: {side}</span>
      </div>
    )
  },
}

const documentActions: Array<{name: string; shortcut?: string; divider?: boolean}> = [
  {name: 'Save', shortcut: '⌘S'},
  {name: 'Save as...', shortcut: '⌘⇧S'},
  {name: 'Export', shortcut: '⌘E'},
  {name: 'Print', shortcut: '⌘P', divider: true},
  {name: 'Copy', shortcut: '⌘C'},
  {name: 'Paste', shortcut: '⌘V'},
  {name: 'Duplicate', shortcut: '⌘D', divider: true},
  {name: 'Share', shortcut: '⌘⇧U'},
  {name: 'Share via email'},
  {name: 'Share via link'},
]

export const InsideDialog: Story = {
  render: function InsideDialogExample() {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const scrollableContent = Array.from({length: 50}, (_, index) => (
      <p key={index} className="mb-3 leading-6">
        This is paragraph {index + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur.
      </p>
    ))

    return (
      <div className="p-5">
        <div>
          <h1 className="mb-4 text-[32px] leading-[48px] font-[700]">Main Page Content</h1>
          <Button className="my-4 !flex" onClick={() => setIsDialogOpen(true)}>
            Open Dialog with ActionMenu
          </Button>
          {scrollableContent}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Dialog.Content width="medium">
            <Dialog.Header>
              <Dialog.Title>Dialog with ActionMenu</Dialog.Title>
              <Dialog.CloseButton />
            </Dialog.Header>
            <Dialog.Body>
              <p className="mb-3 text-sm">
                This dialog contains an ActionMenu. The main page content behind is long enough to be scrollable.
              </p>
              <h3 className="mb-2 font-semibold">Document Settings</h3>
              <p className="mb-4 text-sm text-muted">
                Configure the document properties and sharing settings. These options allow you to control how the
                document is displayed and who has access to it.
              </p>
              <ActionMenu>
                <ActionMenu.Button>Actions</ActionMenu.Button>
                <ActionMenu.Content width="medium">
                  {documentActions.map(action => (
                    <React.Fragment key={action.name}>
                      <ActionMenu.Item onClick={() => notifyClicked(action.name)}>
                        {action.name}
                        {action.shortcut ? (
                          <ActionMenu.TrailingVisual>{action.shortcut}</ActionMenu.TrailingVisual>
                        ) : null}
                      </ActionMenu.Item>
                      {action.divider ? <ActionMenu.Divider /> : null}
                    </React.Fragment>
                  ))}
                </ActionMenu.Content>
              </ActionMenu>
              <p className="mt-3 text-sm">
                You can interact with the ActionMenu above while the main page content remains scrollable in the
                background.
              </p>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog>
      </div>
    )
  },
}

export const CenteredOnPage: Story = {
  render: function CenteredOnPageExample() {
    const [open, setOpen] = React.useState(false)

    return (
      <div className="absolute top-1/2 left-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2">
        <ActionMenu open={open} onOpenChange={setOpen}>
          <ActionMenu.Button>Open menu</ActionMenu.Button>
          <ActionMenu.Content width="medium">
            <CommentActions onAction={notifyClicked} />
          </ActionMenu.Content>
        </ActionMenu>
      </div>
    )
  },
}

export const TwoActionMenus: Story = {
  render: () => (
    <div className="flex gap-4 p-4">
      <ActionMenu>
        <ActionMenu.Button>First menu</ActionMenu.Button>
        <ActionMenu.Content width="medium">
          <ActionMenu.Item onClick={() => notifyClicked('Copy')}>
            <ActionMenu.LeadingVisual>
              <CopyIcon />
            </ActionMenu.LeadingVisual>
            Copy
            <ActionMenu.TrailingVisual>⌘C</ActionMenu.TrailingVisual>
          </ActionMenu.Item>
          <ActionMenu.Item onClick={() => notifyClicked('Archive')}>
            <ActionMenu.LeadingVisual>
              <ArchiveIcon />
            </ActionMenu.LeadingVisual>
            Archive
          </ActionMenu.Item>
          <ActionMenu.Divider />
          <ActionMenu.Item variant="danger" onClick={() => notifyClicked('Delete')}>
            Delete
            <ActionMenu.TrailingVisual>⌘D</ActionMenu.TrailingVisual>
          </ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>
      <ActionMenu>
        <ActionMenu.Button leadingVisual={GearIcon}>Second menu</ActionMenu.Button>
        <ActionMenu.Content width="medium">
          <ActionMenu.Item onClick={() => notifyClicked('Settings')}>
            <ActionMenu.LeadingVisual>
              <GearIcon />
            </ActionMenu.LeadingVisual>
            Settings
          </ActionMenu.Item>
          <ActionMenu.Item onClick={() => notifyClicked('Workflows')}>
            <ActionMenu.LeadingVisual>
              <WorkflowIcon />
            </ActionMenu.LeadingVisual>
            Workflows
          </ActionMenu.Item>
          <ActionMenu.Divider />
          <ActionMenu.LinkItem href="#">
            <ActionMenu.LeadingVisual>
              <BookIcon />
            </ActionMenu.LeadingVisual>
            Documentation
          </ActionMenu.LinkItem>
        </ActionMenu.Content>
      </ActionMenu>
    </div>
  ),
}

export const PreventFocusOnClose: Story = {
  render: function PreventFocusOnCloseExample() {
    const [open, setOpen] = React.useState(false)
    const [preview, setPreview] = React.useState(false)
    const editorRef = React.useRef<HTMLInputElement>(null)
    const selectionRef = React.useRef({start: 0, end: 0})

    const onOpenChange = (nextOpen: boolean) => {
      const editor = editorRef.current
      if (nextOpen) {
        selectionRef.current = {start: editor?.selectionStart ?? 0, end: editor?.selectionEnd ?? 0}
        setOpen(true)
      } else {
        // Close the menu before restoring the editor selection.
        flushSync(() => setOpen(false))
        editor?.focus()
        editor?.setSelectionRange(selectionRef.current.start, selectionRef.current.end)
      }
    }

    return (
      <>
        <FormControl>
          <FormControl.Label>Document</FormControl.Label>
          <TextInput ref={editorRef} defaultValue="Edit this document, then change the link presentation." />
        </FormControl>
        <ActionMenu open={open} onOpenChange={onOpenChange}>
          <ActionMenu.Button key={preview ? 'preview' : 'link'}>
            {preview ? 'Preview actions' : 'Link actions'}
          </ActionMenu.Button>
          <ActionMenu.Content preventFocusOnClose>
            <ActionMenu.Item onClick={() => setPreview(true)}>Convert to preview</ActionMenu.Item>
            <ActionMenu.Item onClick={() => setPreview(false)}>Convert to link</ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
      </>
    )
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    const editor = canvas.getByRole<HTMLInputElement>('textbox', {name: 'Document'})
    await userEvent.click(editor)
    await userEvent.keyboard('{Home}{ArrowRight}{ArrowRight}{ArrowRight}')
    const selectionStart = editor.selectionStart
    const selectionEnd = editor.selectionEnd
    const anchor = canvas.getByRole('button', {name: 'Link actions'})

    await userEvent.click(anchor)
    await userEvent.click(within(canvasElement.ownerDocument.body).getByRole('menuitem', {name: 'Convert to preview'}))

    await expect(anchor).not.toBeInTheDocument()
    await expect(canvas.getByRole('button', {name: 'Preview actions'})).not.toHaveFocus()
    await expect(editor).toHaveFocus()
    await expect(editor.selectionStart).toBe(selectionStart)
    await expect(editor.selectionEnd).toBe(selectionEnd)
  },
}
