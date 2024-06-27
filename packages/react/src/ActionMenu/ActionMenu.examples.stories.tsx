import React from 'react'
import {Box, ActionMenu, ActionList, Button, IconButton, FormControl, TextInput} from '../'
import {
  GearIcon,
  MilestoneIcon,
  KebabHorizontalIcon,
  IssueOpenedIcon,
  TableIcon,
  PeopleIcon,
  TypographyIcon,
  NumberIcon,
  CalendarIcon,
  XIcon,
  CheckIcon,
  CopyIcon,
  ArchiveIcon,
  BookIcon,
  CommentIcon,
  RocketIcon,
  WorkflowIcon,
} from '@primer/octicons-react'

export default {
  title: 'Components/ActionMenu/Examples',
}
export const GroupsAndDescriptions = () => {
  const milestones = [
    {name: 'FY21 - Q2', due: 'December 31, 2021', progress: 90},
    {name: 'FY22 - Q3', due: 'March 31, 2022', progress: 10},
    {name: 'FY23 - Q1', due: 'June 30, 2022', progress: 0},
    {name: 'FY23 - Q2', due: 'December 30, 2022', progress: 0},
  ]

  const [selectedMilestone, setSelectedMilestone] = React.useState<(typeof milestones)[0] | undefined>(milestones[2])

  return (
    <ActionMenu open>
      <ActionMenu.Button variant="default">
        <Box sx={{display: 'inline-block', color: 'fg.muted'}}>Milestone:</Box>{' '}
        {selectedMilestone?.name || 'Make a selection'}
      </ActionMenu.Button>
      <ActionMenu.Overlay width="medium">
        <ActionList selectionVariant="single" showDividers>
          <ActionList.Group>
            <ActionList.GroupHeading>Open</ActionList.GroupHeading>
            {milestones
              .filter(milestone => !milestone.name.includes('21'))
              .map((milestone, index) => (
                <ActionList.Item
                  key={index}
                  selected={milestone.name === selectedMilestone?.name}
                  onSelect={() => setSelectedMilestone(milestone)}
                >
                  <ActionList.LeadingVisual>
                    <MilestoneIcon />
                  </ActionList.LeadingVisual>
                  {milestone.name}
                  <ActionList.Description variant="block">Due by {milestone.due}</ActionList.Description>
                </ActionList.Item>
              ))}
          </ActionList.Group>
          <ActionList.Group>
            <ActionList.GroupHeading>Closed</ActionList.GroupHeading>
            {milestones
              .filter(milestone => milestone.name.includes('21'))
              .map((milestone, index) => (
                <ActionList.Item
                  key={index}
                  selected={milestone.name === selectedMilestone?.name}
                  onSelect={() => setSelectedMilestone(milestone)}
                >
                  <ActionList.LeadingVisual>
                    <MilestoneIcon />
                  </ActionList.LeadingVisual>
                  {milestone.name}
                  <ActionList.Description variant="block">Due by {milestone.due}</ActionList.Description>
                </ActionList.Item>
              ))}
          </ActionList.Group>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  )
}

export const CustomOverlayProps = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <Box sx={{display: 'flex', justifyContent: 'center'}}>
      <ActionMenu open={open} onOpenChange={setOpen}>
        <ActionMenu.Button>Menu</ActionMenu.Button>
        <ActionMenu.Overlay width="large" align="center">
          <ActionList>
            <ActionList.Item>Option 1</ActionList.Item>
            <ActionList.Item>Option 2</ActionList.Item>
            <ActionList.Item>Option 2</ActionList.Item>
            <ActionList.Item>Option 2</ActionList.Item>
            <ActionList.Item>Option 2</ActionList.Item>
            <ActionList.Item>Option 2</ActionList.Item>
            <ActionList.Item>Option 2</ActionList.Item>
            <ActionList.Item>Option 2</ActionList.Item>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </Box>
  )
}

export const ControlledMenu = () => {
  const [actionFired, fireAction] = React.useState('')
  const onSelect = (name: string) => fireAction(name)

  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  return (
    <>
      <h1>Controlled Menu</h1>
      <h2>External Open State: {open ? 'Open' : 'Closed'}</h2>
      <h2>Last option activated: {actionFired}</h2>
      <div>
        <Button ref={triggerRef} onClick={() => setOpen(!open)}>
          {open ? 'Close Menu' : 'Open Menu'}
        </Button>
      </div>
      <br />

      {/**
       * Even though the state is controlled externally,
       * we can pass an Anchor for the menu to "anchor to"
       */}
      <ActionMenu open={open} onOpenChange={setOpen}>
        <ActionMenu.Button>Anchor</ActionMenu.Button>
        <ActionMenu.Overlay
          ignoreClickRefs={[
            // Because the component is controlled from outside, but the anchor is still internal,
            // clicking the external button should not be counted as "clicking outside"
            triggerRef,
          ]}
        >
          <ActionList>
            <ActionList.Item onSelect={() => onSelect('Copy link')}>
              Copy link
              <ActionList.TrailingVisual>⌘C</ActionList.TrailingVisual>
            </ActionList.Item>
            <ActionList.Item onSelect={() => onSelect('Quote reply')}>
              Quote reply
              <ActionList.TrailingVisual>⌘Q</ActionList.TrailingVisual>
            </ActionList.Item>
            <ActionList.Item onSelect={() => onSelect('Edit comment')}>
              Edit comment
              <ActionList.TrailingVisual>⌘E</ActionList.TrailingVisual>
            </ActionList.Item>
            <ActionList.Divider />
            <ActionList.Item variant="danger" onSelect={() => onSelect('Delete file')}>
              Delete file
              <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
            </ActionList.Item>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </>
  )
}

export const ShortcutMenu = () => {
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && (event.key === 'c' || event.key === 'C')) {
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  return (
    <>
      <h1>Shortcut Menu</h1>
      <h2>External Open State: {open ? 'Open' : 'Closed'}</h2>
      <h2>Press Shift+C to open the menu</h2>
      <br />

      {/**
       * This is used to demonstrate mouse/keyboard modality
       * and how it might affect `:focus-visible` styles in the menu.
       */}
      <FormControl>
        <FormControl.Label>Default label</FormControl.Label>
        <TextInput />
      </FormControl>

      {/**
       * Even though the state is controlled externally,
       * we can pass an Anchor for the menu to "anchor to"
       */}
      <ActionMenu open={open} onOpenChange={setOpen}>
        <ActionMenu.Button sx={{visibility: 'hidden'}}>Anchor</ActionMenu.Button>
        <ActionMenu.Overlay
          ignoreClickRefs={[
            // Because the component is controlled from outside, but the anchor is still internal,
            // clicking the external button should not be counted as "clicking outside"
            triggerRef,
          ]}
        >
          <ActionList>
            <ActionList.Item>
              Copy link
              <ActionList.TrailingVisual>⌘C</ActionList.TrailingVisual>
            </ActionList.Item>
            <ActionList.Item>
              Quote reply
              <ActionList.TrailingVisual>⌘Q</ActionList.TrailingVisual>
            </ActionList.Item>
            <ActionList.Item>
              Edit comment
              <ActionList.TrailingVisual>⌘E</ActionList.TrailingVisual>
            </ActionList.Item>
            <ActionList.LinkItem href="#">View file</ActionList.LinkItem>
            <ActionList.Divider />
            <ActionList.Item variant="danger">
              Delete file
              <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
            </ActionList.Item>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </>
  )
}

export const CustomAnchor = () => (
  <ActionMenu>
    <ActionMenu.Anchor>
      <IconButton icon={KebabHorizontalIcon} aria-label="Open menu" />
    </ActionMenu.Anchor>
    <ActionMenu.Overlay width="medium">
      <ActionList>
        <ActionList.Item onSelect={() => alert('Copy link clicked')}>
          Copy link
          <ActionList.TrailingVisual>⌘C</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Item onSelect={() => alert('Quote reply clicked')}>
          Quote reply
          <ActionList.TrailingVisual>⌘Q</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Item onSelect={() => alert('Edit comment clicked')}>
          Edit comment
          <ActionList.TrailingVisual>⌘E</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Divider />
        <ActionList.Item variant="danger" onSelect={() => alert('Delete file clicked')}>
          Delete file
          <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
        </ActionList.Item>
      </ActionList>
    </ActionMenu.Overlay>
  </ActionMenu>
)

export const CustomAnchorId = () => (
  <ActionMenu>
    <ActionMenu.Anchor id="custom-anchor-id">
      <IconButton icon={KebabHorizontalIcon} aria-label="Open menu" />
    </ActionMenu.Anchor>
    <ActionMenu.Overlay width="medium">
      <ActionList>
        <ActionList.Item onSelect={() => alert('Copy link clicked')}>
          Copy link
          <ActionList.TrailingVisual>⌘C</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Item onSelect={() => alert('Quote reply clicked')}>
          Quote reply
          <ActionList.TrailingVisual>⌘Q</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Item onSelect={() => alert('Edit comment clicked')}>
          Edit comment
          <ActionList.TrailingVisual>⌘E</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Divider />
        <ActionList.Item variant="danger" onSelect={() => alert('Delete file clicked')}>
          Delete file
          <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
        </ActionList.Item>
      </ActionList>
    </ActionMenu.Overlay>
  </ActionMenu>
)

export const MixedSelection = () => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(1)

  const options = [
    {text: 'Status', icon: IssueOpenedIcon},
    {text: 'Stage', icon: TableIcon},
    {text: 'Assignee', icon: PeopleIcon},
    {text: 'Team', icon: TypographyIcon},
    {text: 'Estimate', icon: NumberIcon},
    {text: 'Due Date', icon: CalendarIcon},
  ]

  const selectedOption = selectedIndex !== null && options[selectedIndex]

  return (
    <ActionMenu>
      <ActionMenu.Button leadingVisual={selectedOption ? selectedOption.icon : undefined}>
        {selectedOption ? `Group by ${selectedOption.text}` : 'Group items by'}
      </ActionMenu.Button>
      <ActionMenu.Overlay width="medium">
        <ActionList>
          <ActionList.Group selectionVariant="single">
            <ActionList.GroupHeading>Group by</ActionList.GroupHeading>
            {options.map((option, index) => (
              <ActionList.Item key={index} selected={index === selectedIndex} onSelect={() => setSelectedIndex(index)}>
                <ActionList.LeadingVisual>
                  <option.icon />
                </ActionList.LeadingVisual>
                {option.text}
              </ActionList.Item>
            ))}
          </ActionList.Group>
          {typeof selectedIndex === 'number' && (
            <ActionList.Group>
              <ActionList.Divider />
              <ActionList.Item onSelect={() => setSelectedIndex(null)}>
                <ActionList.LeadingVisual>
                  <XIcon />
                </ActionList.LeadingVisual>
                Clear Group by
              </ActionList.Item>
            </ActionList.Group>
          )}
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  )
}

export const MultipleSections = () => {
  const items = [{name: 'Show code folding buttons'}, {name: 'Wrap lines'}, {name: 'Center content'}]

  const [selectedMilestone, setSelectedMilestone] = React.useState<(typeof items)[0] | undefined>(items[0])

  return (
    <ActionMenu open>
      <ActionMenu.Anchor>
        <IconButton icon={KebabHorizontalIcon} aria-label="Open menu" />
      </ActionMenu.Anchor>
      <ActionMenu.Overlay width="small">
        <ActionList>
          <ActionList.Group selectionVariant="multiple">
            <ActionList.GroupHeading>Raw file content</ActionList.GroupHeading>
            <ActionList.Item onSelect={() => alert('Workflows clicked')}>Download</ActionList.Item>
            <ActionList.Divider />
            <ActionList.Item onSelect={() => alert('Workflows clicked')}>Jump to line</ActionList.Item>
            <ActionList.Item onSelect={() => alert('Workflows clicked')}>Find in file</ActionList.Item>
            <ActionList.Divider />
            <ActionList.Item onSelect={() => alert('Workflows clicked')}>Copy path</ActionList.Item>
            <ActionList.Item onSelect={() => alert('Workflows clicked')}>Copy permalink</ActionList.Item>
          </ActionList.Group>
          <ActionList.Divider />
          <ActionList.Group selectionVariant="multiple">
            <ActionList.GroupHeading>View options</ActionList.GroupHeading>
            {items.map((item, index) => (
              <ActionList.Item
                key={index}
                selected={item.name === selectedMilestone?.name}
                onSelect={() => setSelectedMilestone(item)}
              >
                {item.name}
              </ActionList.Item>
            ))}
          </ActionList.Group>
          <ActionList.Divider />
          <ActionList.Group selectionVariant="multiple">
            <ActionList.GroupHeading>View options</ActionList.GroupHeading>
            <ActionList.Item onSelect={() => alert('Delete file')} variant="danger">
              Delete file
            </ActionList.Item>
          </ActionList.Group>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  )
}

export const DelayedMenuClose = () => {
  const [open, setOpen] = React.useState(false)
  const [copyLinkSuccess, setCopyLinkSuccess] = React.useState(false)
  const onSelect = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.preventDefault()

    setCopyLinkSuccess(true)
    setTimeout(() => {
      setOpen(false)
      setCopyLinkSuccess(false)
    }, 700)
  }

  return (
    <>
      <h1>Delayed Menu Close</h1>

      <ActionMenu open={open} onOpenChange={setOpen}>
        <ActionMenu.Button>Anchor</ActionMenu.Button>
        <ActionMenu.Overlay>
          <ActionList>
            <ActionList.Item onSelect={onSelect}>
              <ActionList.LeadingVisual>{copyLinkSuccess ? <CheckIcon /> : <CopyIcon />}</ActionList.LeadingVisual>
              {copyLinkSuccess ? 'Copied!' : 'Copy link'}
            </ActionList.Item>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </>
  )
}

export const OnRightSide = () => (
  <ActionMenu>
    <ActionMenu.Button>Open menu</ActionMenu.Button>
    <ActionMenu.Overlay width="medium" side="outside-right">
      <ActionList>
        <ActionList.Item onSelect={() => alert('Copy link clicked')}>
          Copy link
          <ActionList.TrailingVisual>⌘C</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Item onSelect={() => alert('Quote reply clicked')}>
          Quote reply
          <ActionList.TrailingVisual>⌘Q</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Item onSelect={() => alert('Edit comment clicked')}>
          Edit comment
          <ActionList.TrailingVisual>⌘E</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Divider />
        <ActionList.Item variant="danger" onSelect={() => alert('Delete file clicked')}>
          Delete file
          <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
        </ActionList.Item>
      </ActionList>
    </ActionMenu.Overlay>
  </ActionMenu>
)

export const SettingMaxHeight = () => {
  return (
    <ActionMenu>
      <ActionMenu.Button>Open menu</ActionMenu.Button>
      <ActionMenu.Overlay width="auto" maxHeight="large" overflow="auto">
        <ActionList>
          {Array.from({length: 100}, (_, i) => (
            <ActionList.Item key={`item-${i}`} onSelect={() => alert(`Item ${i + 1} clicked`)}>
              Item {i + 1}
            </ActionList.Item>
          ))}
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  )
}

export const OnlyInactiveItems = () => (
  <ActionMenu>
    <ActionMenu.Button inactive>Open menu</ActionMenu.Button>
    <ActionMenu.Overlay width="auto">
      <ActionList>
        <ActionList.Item onSelect={() => alert('Workflows clicked')} inactiveText="Unavailable due to an outage">
          Workflows
          <ActionList.LeadingVisual>
            <WorkflowIcon />
          </ActionList.LeadingVisual>
        </ActionList.Item>
        <ActionList.Item onSelect={() => alert('Archived items clicked')} inactiveText="Unavailable due to an outage">
          Archived items
          <ActionList.LeadingVisual>
            <ArchiveIcon />
          </ActionList.LeadingVisual>
        </ActionList.Item>
        <ActionList.LinkItem href="/" inactiveText="Unavailable due to an outage">
          Settings
          <ActionList.LeadingVisual>
            <GearIcon />
          </ActionList.LeadingVisual>
        </ActionList.LinkItem>
        <ActionList.Item onSelect={() => alert('Make a copy clicked')} inactiveText="Unavailable due to an outage">
          Make a copy
          <ActionList.LeadingVisual>
            <CopyIcon />
          </ActionList.LeadingVisual>
        </ActionList.Item>
        <ActionList.Divider />
        <ActionList.Group>
          <ActionList.GroupHeading>Github projects</ActionList.GroupHeading>
          <ActionList.LinkItem href="/" inactiveText="Unavailable due to an outage">
            What&apos;s new
            <ActionList.LeadingVisual>
              <RocketIcon />
            </ActionList.LeadingVisual>
          </ActionList.LinkItem>
          <ActionList.LinkItem href="/" inactiveText="Unavailable due to an outage">
            Give feedback
            <ActionList.LeadingVisual>
              <CommentIcon />
            </ActionList.LeadingVisual>
          </ActionList.LinkItem>
          <ActionList.LinkItem href="/" inactiveText="Unavailable due to an outage">
            GitHub Docs
            <ActionList.LeadingVisual>
              <BookIcon />
            </ActionList.LeadingVisual>
          </ActionList.LinkItem>
        </ActionList.Group>
      </ActionList>
    </ActionMenu.Overlay>
  </ActionMenu>
)
