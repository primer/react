import React from 'react'
import {ActionMenu, ActionList, Box} from '../'
import {WorkflowIcon, ArchiveIcon, GearIcon, CopyIcon, RocketIcon, CommentIcon, BookIcon} from '@primer/octicons-react'

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
        <ActionList.Group title="GitHub projects">
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
        <Box sx={{color: 'fg.muted', display: 'inline-block'}}>Options:</Box> {selectedType.name}
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
        <ActionList.Group title="Github projects">
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
