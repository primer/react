import React from 'react'
import {GearIcon, KebabHorizontalIcon, MilestoneIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {Button} from '../Button'
import {Dialog} from '../Dialog'
import {FormControl} from '../FormControl'
import {IconButton} from '../IconButton'
import {TextInput} from '../TextInput'
import {ActionMenu} from './ActionMenu'

const meta = {
  title: 'React Tailwind/Components/ActionMenu/Examples',
  component: ActionMenu,
} satisfies Meta<typeof ActionMenu>

export default meta
type Story = StoryObj<typeof meta>
const defaultMenuItems = ['Option 1', 'Option 2', 'Option 3']

function MenuExample({title = 'Menu', items = defaultMenuItems}: {title?: string; items?: string[]}) {
  return (
    <ActionMenu>
      <ActionMenu.Button>{title}</ActionMenu.Button>
      <ActionMenu.Content>
        {items.map(item => (
          <ActionMenu.Item key={item}>{item}</ActionMenu.Item>
        ))}
      </ActionMenu.Content>
    </ActionMenu>
  )
}

export const GroupsAndDescriptions: Story = {
  render: () => (
    <ActionMenu defaultOpen>
      <ActionMenu.Button>
        <span className="text-muted">Milestone:</span> FY23 - Q1
      </ActionMenu.Button>
      <ActionMenu.Content className="w-80">
        <ActionMenu.Group>
          <ActionMenu.GroupLabel>Open</ActionMenu.GroupLabel>
          <ActionMenu.Item selected={false}>
            <ActionMenu.LeadingVisual>
              <MilestoneIcon />
            </ActionMenu.LeadingVisual>
            FY22 - Q3
            <ActionMenu.Description variant="block">Due by March 31, 2022</ActionMenu.Description>
          </ActionMenu.Item>
          <ActionMenu.Item selected>
            <ActionMenu.LeadingVisual>
              <MilestoneIcon />
            </ActionMenu.LeadingVisual>
            FY23 - Q1
            <ActionMenu.Description variant="block">Due by June 30, 2022</ActionMenu.Description>
          </ActionMenu.Item>
          <ActionMenu.Item selected={false}>
            <ActionMenu.LeadingVisual>
              <MilestoneIcon />
            </ActionMenu.LeadingVisual>
            FY23 - Q2
            <ActionMenu.Description variant="block">Due by December 30, 2022</ActionMenu.Description>
          </ActionMenu.Item>
        </ActionMenu.Group>
        <ActionMenu.Group>
          <ActionMenu.GroupLabel>Closed</ActionMenu.GroupLabel>
          <ActionMenu.Item selected={false}>
            <ActionMenu.LeadingVisual>
              <MilestoneIcon />
            </ActionMenu.LeadingVisual>
            FY21 - Q2
            <ActionMenu.Description variant="block">Due by December 31, 2021</ActionMenu.Description>
          </ActionMenu.Item>
        </ActionMenu.Group>
      </ActionMenu.Content>
    </ActionMenu>
  ),
}

export const CustomOverlayProps: Story = {
  render: () => (
    <div className="flex justify-center">
      <MenuExample items={Array.from({length: 8}, (_, index) => `Option ${index + 1}`)} />
    </div>
  ),
}
export const FullScreen: Story = {
  render: () => (
    <div className="flex justify-center">
      <MenuExample items={Array.from({length: 8}, (_, index) => `Option ${index + 1}`)} />
    </div>
  ),
}

export const ControlledMenu: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    const [action, setAction] = React.useState('')
    return (
      <>
        <h1>Controlled Menu</h1>
        <h2>External Open State: {open ? 'Open' : 'Closed'}</h2>
        <h2>Last option activated: {action}</h2>
        <div>
          <Button onClick={() => setOpen(value => !value)}>{open ? 'Close Menu' : 'Open Menu'}</Button>
        </div>
        <br />
        <ActionMenu open={open} onOpenChange={setOpen}>
          <ActionMenu.Button>Anchor</ActionMenu.Button>
          <ActionMenu.Content>
            {['Copy link', 'Quote reply', 'Edit comment', 'Delete file'].map(item => (
              <ActionMenu.Item
                key={item}
                variant={item === 'Delete file' ? 'danger' : 'default'}
                onClick={() => setAction(item)}
              >
                {item}
              </ActionMenu.Item>
            ))}
          </ActionMenu.Content>
        </ActionMenu>
      </>
    )
  },
}

export const ShortcutMenu: Story = {
  render: () => (
    <>
      <h1>Shortcut Menu</h1>
      <h2>External Open State: Closed</h2>
      <h2>Press Shift+C to open the menu</h2>
      <br />
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <TextInput />
      </FormControl>
      <ActionMenu>
        <ActionMenu.Button className="invisible">Anchor</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item>Copy link</ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>
    </>
  ),
}
export const ContextMenu: Story = {
  render: () => (
    <>
      <div>Right click the list items below to see the context menu</div>
      <ul>
        {['List item one', 'List item two', 'List item three'].map(item => (
          <li key={item}>
            <ActionMenu>
              <ActionMenu.Button variant="invisible">{item}</ActionMenu.Button>
              <ActionMenu.Content>
                <ActionMenu.Item>Copy link</ActionMenu.Item>
              </ActionMenu.Content>
            </ActionMenu>
          </li>
        ))}
      </ul>
    </>
  ),
}
export const CustomAnchor: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Trigger render={<IconButton aria-label="Open menu" icon={KebabHorizontalIcon} />} />
      <ActionMenu.Content>
        <ActionMenu.Item>Copy link</ActionMenu.Item>
      </ActionMenu.Content>
    </ActionMenu>
  ),
}
export const CustomAnchorId: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Trigger
        id="custom-anchor-id"
        render={<IconButton aria-label="Open menu" icon={KebabHorizontalIcon} />}
      />
      <ActionMenu.Content>
        <ActionMenu.Item>Copy link</ActionMenu.Item>
      </ActionMenu.Content>
    </ActionMenu>
  ),
}
export const MixedSelection: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button leadingVisual={GearIcon}>Group by Stage</ActionMenu.Button>
      <ActionMenu.Content>
        <ActionMenu.Item>Copy link</ActionMenu.Item>
        <ActionMenu.CheckboxItem checked>Wrap lines</ActionMenu.CheckboxItem>
        <ActionMenu.RadioGroup>
          <ActionMenu.RadioItem value="light">Light</ActionMenu.RadioItem>
          <ActionMenu.RadioItem value="dark">Dark</ActionMenu.RadioItem>
        </ActionMenu.RadioGroup>
      </ActionMenu.Content>
    </ActionMenu>
  ),
}
export const MultipleSections: Story = {
  render: () => (
    <ActionMenu defaultOpen>
      <ActionMenu.Trigger render={<IconButton aria-label="Open menu" icon={KebabHorizontalIcon} />} />
      <ActionMenu.Content>
        <ActionMenu.Group>
          <ActionMenu.GroupLabel>Raw file content</ActionMenu.GroupLabel>
          <ActionMenu.Item>Download</ActionMenu.Item>
          <ActionMenu.Divider />
          <ActionMenu.Item>Jump to line</ActionMenu.Item>
          <ActionMenu.Item>Find in file</ActionMenu.Item>
          <ActionMenu.Divider />
          <ActionMenu.Item>Copy path</ActionMenu.Item>
          <ActionMenu.Item>Copy permalink</ActionMenu.Item>
        </ActionMenu.Group>
        <ActionMenu.Divider />
        <ActionMenu.Group>
          <ActionMenu.GroupLabel>View options</ActionMenu.GroupLabel>
          <ActionMenu.CheckboxItem checked>Show code folding buttons</ActionMenu.CheckboxItem>
          <ActionMenu.CheckboxItem>Wrap lines</ActionMenu.CheckboxItem>
          <ActionMenu.CheckboxItem>Center content</ActionMenu.CheckboxItem>
        </ActionMenu.Group>
        <ActionMenu.Divider />
        <ActionMenu.Item variant="danger">Delete file</ActionMenu.Item>
      </ActionMenu.Content>
    </ActionMenu>
  ),
}
export const DelayedMenuClose: Story = {
  render: () => (
    <>
      <h1>Delayed Menu Close</h1>
      <MenuExample title="Anchor" />
    </>
  ),
}
export const OnRightSide: Story = {
  render: () => <MenuExample title="Open menu" />,
}
export const SettingMaxHeight: Story = {
  render: () => <MenuExample title="Open menu" items={Array.from({length: 100}, (_, index) => `Item ${index + 1}`)} />,
}
export const OnlyInactiveItems: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button inactive>Open menu</ActionMenu.Button>
      <ActionMenu.Content>
        <ActionMenu.Item disabled>Unavailable</ActionMenu.Item>
      </ActionMenu.Content>
    </ActionMenu>
  ),
}
export const DynamicAnchorSides: Story = {
  render: () => (
    <div className="absolute top-1/2 left-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2">
      <MenuExample title="Open menu" />
      <span>Current Overlay Side: outside-bottom</span>
    </div>
  ),
}
export const InsideDialog: Story = {
  render: () => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const scrollableContent = Array.from({length: 50}, (_, index) => (
      <p key={index} className="mb-3 text-base leading-6">
        This is paragraph {index + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur.
      </p>
    ))

    return (
      <div className="p-5">
        <div>
          <h1 className="mb-4 text-[32px] leading-[48px] font-bold">Main Page Content</h1>
          <Button className="my-4 !flex" onClick={() => setIsDialogOpen(true)}>
            Open Dialog with ActionMenu
          </Button>
          {scrollableContent}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Dialog with ActionMenu</Dialog.Title>
              <Dialog.CloseButton />
            </Dialog.Header>
            <Dialog.Body>
              <p className="mb-3 text-sm">
                This dialog contains an ActionMenu. The main page content behind is long enough to be scrollable.
              </p>
              <h3 className="mb-2 text-base font-semibold">Document Settings</h3>
              <p className="mb-4 text-sm text-muted">
                Configure the document properties and sharing settings. These options allow you to control how the
                document is displayed and who has access to it.
              </p>
              <MenuExample
                title="Actions"
                items={[
                  'Save',
                  'Save as...',
                  'Export',
                  'Print',
                  'Copy',
                  'Paste',
                  'Duplicate',
                  'Share',
                  'Share via email',
                  'Share via link',
                ]}
              />
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
  render: () => (
    <div className="absolute top-1/2 left-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2">
      <MenuExample title="Open menu" />
    </div>
  ),
}
export const TwoActionMenus: Story = {
  render: () => (
    <div className="flex gap-4 p-4">
      <MenuExample title="First menu" />
      <ActionMenu>
        <ActionMenu.Button leadingVisual={GearIcon}>Second menu</ActionMenu.Button>
        <ActionMenu.Content>
          <ActionMenu.Item>Settings</ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>
    </div>
  ),
}
