import React from 'react'
import {ActionMenu, ActionList} from '../'
import {
  WorkflowIcon,
  ArchiveIcon,
  GearIcon,
  CopyIcon,
  RocketIcon,
  CommentIcon,
  BookIcon,
  SparkleFillIcon,
} from '@primer/octicons-react'
import classes from './ActionMenu.features.stories.module.css'

export default {
  title: 'Components/ActionMenu/Features',
}

export const LinksAndActions = () => (
  <ActionMenu>
    <ActionMenu.Button>Open menu</ActionMenu.Button>
    <ActionMenu.Overlay width="auto">
      <ActionList>
        <ActionList.Item onSelect={() => alert('Workflows clicked')}>
          Workflows
          <ActionList.LeadingVisual>
            <WorkflowIcon />
          </ActionList.LeadingVisual>
        </ActionList.Item>
        <ActionList.Item onSelect={() => alert('Archived items clicked')}>
          Archived items
          <ActionList.LeadingVisual>
            <ArchiveIcon />
          </ActionList.LeadingVisual>
        </ActionList.Item>
        <ActionList.LinkItem href="/">
          Settings
          <ActionList.LeadingVisual>
            <GearIcon />
          </ActionList.LeadingVisual>
        </ActionList.LinkItem>
        <ActionList.Item onSelect={() => alert('Make a copy clicked')}>
          Make a copy
          <ActionList.LeadingVisual>
            <CopyIcon />
          </ActionList.LeadingVisual>
        </ActionList.Item>
        <ActionList.Divider />
        <ActionList.Group>
          <ActionList.GroupHeading>GitHub projects</ActionList.GroupHeading>
          <ActionList.LinkItem href="/">
            What&apos;s new
            <ActionList.LeadingVisual>
              <RocketIcon />
            </ActionList.LeadingVisual>
          </ActionList.LinkItem>
          <ActionList.LinkItem href="/">
            Give feedback
            <ActionList.LeadingVisual>
              <CommentIcon />
            </ActionList.LeadingVisual>
          </ActionList.LinkItem>
          <ActionList.LinkItem href="/">
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

export const SingleSelect = () => {
  const options = [
    {name: 'Fast forward'},
    {name: 'Recursive'},
    {name: 'Ours'},
    {name: 'Octopus'},
    {name: 'Resolve'},
    {name: 'Subtree'},
  ]
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const selectedType = options[selectedIndex]

  return (
    <ActionMenu>
      <ActionMenu.Button>
        <span className={classes.MutedText}>Options:</span> {selectedType.name}
      </ActionMenu.Button>
      <ActionMenu.Overlay width="auto">
        <ActionList selectionVariant="single">
          {options.map((options, index) => (
            <ActionList.Item key={index} selected={index === selectedIndex} onSelect={() => setSelectedIndex(index)}>
              {options.name}
            </ActionList.Item>
          ))}
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  )
}

export const MultiSelect = () => {
  type Option = {name: string; selected: boolean}

  const [options, setOptions] = React.useState<Option[]>([
    {name: 'Show code folding buttons', selected: true},
    {name: 'Wrap lines', selected: false},
    {name: 'Center content', selected: false},
  ])

  const toggle = (name: string) => {
    setOptions(
      options.map(option => {
        if (option.name === name) option.selected = !option.selected
        return option
      }),
    )
  }

  return (
    <ActionMenu>
      <ActionMenu.Button>Display</ActionMenu.Button>
      <ActionMenu.Overlay width="auto">
        <ActionList selectionVariant="multiple">
          {options.map(options => (
            <ActionList.Item key={options.name} selected={options.selected} onSelect={() => toggle(options.name)}>
              {options.name}
            </ActionList.Item>
          ))}
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  )
}

export const InactiveItems = () => (
  <ActionMenu>
    <ActionMenu.Button>Open menu</ActionMenu.Button>
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
          <ActionList.LinkItem href="/">
            What&apos;s new
            <ActionList.LeadingVisual>
              <RocketIcon />
            </ActionList.LeadingVisual>
          </ActionList.LinkItem>
          <ActionList.LinkItem href="/">
            Give feedback
            <ActionList.LeadingVisual>
              <CommentIcon />
            </ActionList.LeadingVisual>
          </ActionList.LinkItem>
          <ActionList.LinkItem href="/">
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

export const LoadingItems = () => (
  <ActionMenu>
    <ActionMenu.Button>Open menu</ActionMenu.Button>
    <ActionMenu.Overlay width="auto">
      <ActionList>
        <ActionList.Item onSelect={() => alert('Workflows clicked')} loading>
          Workflows
          <ActionList.LeadingVisual>
            <WorkflowIcon />
          </ActionList.LeadingVisual>
        </ActionList.Item>
        <ActionList.Item onSelect={() => alert('Archived items clicked')} loading>
          Archived items
          <ActionList.LeadingVisual>
            <ArchiveIcon />
          </ActionList.LeadingVisual>
        </ActionList.Item>
        <ActionList.Item onSelect={() => alert('Make a copy clicked')} loading>
          Make a copy
          <ActionList.LeadingVisual>
            <CopyIcon />
          </ActionList.LeadingVisual>
        </ActionList.Item>
        <ActionList.Divider />
        <ActionList.Group>
          <ActionList.GroupHeading>Github projects</ActionList.GroupHeading>
          <ActionList.LinkItem href="/">
            What&apos;s new
            <ActionList.LeadingVisual>
              <RocketIcon />
            </ActionList.LeadingVisual>
          </ActionList.LinkItem>
          <ActionList.LinkItem href="/">
            Give feedback
            <ActionList.LeadingVisual>
              <CommentIcon />
            </ActionList.LeadingVisual>
          </ActionList.LinkItem>
          <ActionList.LinkItem href="/">
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

export const Submenus = () => (
  <ActionMenu>
    <ActionMenu.Button>Edit</ActionMenu.Button>
    <ActionMenu.Overlay>
      <ActionList>
        <ActionList.Item>Cut</ActionList.Item>
        <ActionList.Item>Copy</ActionList.Item>
        <ActionList.Item>Paste</ActionList.Item>
        <ActionMenu>
          <ActionMenu.Anchor>
            <ActionList.Item>
              <ActionList.LeadingVisual>
                <SparkleFillIcon />
              </ActionList.LeadingVisual>
              Paste special
            </ActionList.Item>
          </ActionMenu.Anchor>
          <ActionMenu.Overlay>
            <ActionList>
              <ActionList.Item>Paste plain text</ActionList.Item>
              <ActionList.Item>Paste formulas</ActionList.Item>
              <ActionList.Item>Paste with formatting</ActionList.Item>
              <ActionMenu>
                <ActionMenu.Anchor>
                  <ActionList.Item>Paste from</ActionList.Item>
                </ActionMenu.Anchor>
                <ActionMenu.Overlay>
                  <ActionList>
                    <ActionList.Item>Current clipboard</ActionList.Item>
                    <ActionList.Item>History</ActionList.Item>
                    <ActionList.Item>Another device</ActionList.Item>
                  </ActionList>
                </ActionMenu.Overlay>
              </ActionMenu>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      </ActionList>
    </ActionMenu.Overlay>
  </ActionMenu>
)

export const DisabledItems = () => (
  <ActionMenu>
    <ActionMenu.Button>Open menu</ActionMenu.Button>
    <ActionMenu.Overlay width="auto">
      <ActionList>
        <ActionList.Item disabled={true}>
          Workflows
          <ActionList.LeadingVisual>
            <WorkflowIcon />
          </ActionList.LeadingVisual>
        </ActionList.Item>
        <ActionList.Item onSelect={() => alert('Archived items clicked')}>
          Archived items
          <ActionList.LeadingVisual>
            <ArchiveIcon />
          </ActionList.LeadingVisual>
        </ActionList.Item>
        <ActionList.LinkItem href="/">
          Settings
          <ActionList.LeadingVisual>
            <GearIcon />
          </ActionList.LeadingVisual>
        </ActionList.LinkItem>
        <ActionList.Item disabled={true}>
          Make a copy
          <ActionList.LeadingVisual>
            <CopyIcon />
          </ActionList.LeadingVisual>
        </ActionList.Item>
        <ActionList.Divider />
        <ActionList.Group>
          <ActionList.GroupHeading>Github projects</ActionList.GroupHeading>
          <ActionList.LinkItem href="/">
            What&apos;s new
            <ActionList.LeadingVisual>
              <RocketIcon />
            </ActionList.LeadingVisual>
          </ActionList.LinkItem>
          <ActionList.LinkItem href="/">
            Give feedback
            <ActionList.LeadingVisual>
              <CommentIcon />
            </ActionList.LeadingVisual>
          </ActionList.LinkItem>
          <ActionList.LinkItem href="/">
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
