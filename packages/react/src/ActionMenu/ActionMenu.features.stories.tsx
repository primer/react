import React from 'react'
import {ActionMenu} from '.'
import {ActionList} from '../ActionList'
import {
  WorkflowIcon,
  ArchiveIcon,
  GearIcon,
  CopyIcon,
  RocketIcon,
  CommentIcon,
  BookIcon,
  SparkleFillIcon,
  PencilIcon,
  DownloadIcon,
  TrashIcon,
  PeopleIcon,
  PersonIcon,
} from '@primer/octicons-react'
import type {StoryObj} from '@storybook/react-vite'
import {expect, userEvent, waitFor, within} from 'storybook/test'
import Avatar from '../Avatar'
import classes from './ActionMenu.features.stories.module.css'

export default {
  title: 'Components/ActionMenu/Features',
}

export const ModernizedMenu: StoryObj = {
  decorators: [
    Story => (
      <div className={classes.ComparisonStory}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Actions</ActionMenu.Button>
      <ActionMenu.Overlay width="auto">
        <ActionList>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <CopyIcon />
            </ActionList.LeadingVisual>
            Copy
            <ActionList.Description variant="block">Copy to clipboard</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <PencilIcon />
            </ActionList.LeadingVisual>
            Edit
            <ActionList.Description variant="block">Edit this item</ActionList.Description>
          </ActionList.Item>
          <ActionList.Divider />
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <DownloadIcon />
            </ActionList.LeadingVisual>
            Download
            <ActionList.Description variant="block">Download the file to your computer</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item variant="danger">
            <ActionList.LeadingVisual>
              <TrashIcon />
            </ActionList.LeadingVisual>
            Delete
            <ActionList.Description variant="block">This action cannot be undone</ActionList.Description>
          </ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  ),
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', {name: 'Actions'}))
    const body = within(canvasElement.ownerDocument.body)
    await waitFor(() => expect(body.getByRole('menu')).toBeVisible())
    await userEvent.keyboard('{ArrowDown}')
    await expect(body.getByRole('menuitem', {name: 'Edit'})).toHaveFocus()
  },
}

export const ModernizedMenuWithAvatars: StoryObj = {
  decorators: ModernizedMenu.decorators,
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Reviewers</ActionMenu.Button>
      <ActionMenu.Overlay width="auto" style={{minWidth: 280}}>
        <ActionList>
          <ActionList.Group>
            <ActionList.GroupHeading>Request review</ActionList.GroupHeading>
            {[
              {name: 'maximedegreve', description: 'Frontend · Last active 2h ago'},
              {name: 'adrianmg', description: 'Backend · Last active 30m ago'},
              {name: 'daviddossett', description: 'Infrastructure · Last active 1d ago'},
            ].map(({name, description}) => (
              <ActionList.Item key={name}>
                <ActionList.LeadingVisual>
                  <Avatar src={`/mock-avatar-${name}.png`} />
                </ActionList.LeadingVisual>
                {name}
                <ActionList.Description variant="block">{description}</ActionList.Description>
              </ActionList.Item>
            ))}
          </ActionList.Group>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  ),
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', {name: 'Reviewers'}))
    const body = within(canvasElement.ownerDocument.body)
    await waitFor(() => expect(body.getByRole('menu')).toBeVisible())
  },
}

export const ModernizedMenuWithAvatarsOnly: StoryObj = {
  decorators: ModernizedMenu.decorators,
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Reviewers</ActionMenu.Button>
      <ActionMenu.Overlay width="auto" style={{minWidth: 280}}>
        <ActionList>
          <ActionList.Group>
            <ActionList.GroupHeading>Request review</ActionList.GroupHeading>
            {['maximedegreve', 'adrianmg', 'daviddossett'].map(name => (
              <ActionList.Item key={name}>
                <ActionList.LeadingVisual>
                  <Avatar src={`/mock-avatar-${name}.png`} />
                </ActionList.LeadingVisual>
                {name}
              </ActionList.Item>
            ))}
          </ActionList.Group>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  ),
  play: ModernizedMenuWithAvatars.play,
}

export const ModernizedMenuWithStates: StoryObj = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Reviewers</ActionMenu.Button>
      <ActionMenu.Overlay width="auto">
        <ActionList>
          <ActionList.Group>
            <ActionList.GroupHeading>Request review</ActionList.GroupHeading>
            {['mona', 'octocat', 'hubot'].map(name => (
              <ActionList.Item key={name}>
                <ActionList.LeadingVisual>
                  <Avatar src="/mock-avatar.png" />
                </ActionList.LeadingVisual>
                {name}
                <ActionList.Description variant="block">Available for review</ActionList.Description>
              </ActionList.Item>
            ))}
          </ActionList.Group>
          <ActionList.Divider />
          <ActionMenu>
            <ActionMenu.Anchor>
              <ActionList.Item>
                <ActionList.LeadingVisual>
                  <PeopleIcon />
                </ActionList.LeadingVisual>
                More reviewers
                <ActionList.Description variant="block">Choose from another team</ActionList.Description>
              </ActionList.Item>
            </ActionMenu.Anchor>
            <ActionMenu.Overlay width="auto">
              <ActionList>
                <ActionList.Item>Design</ActionList.Item>
                <ActionList.Item>Engineering</ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
          <ActionList.Item loading>
            <ActionList.LeadingVisual>
              <PersonIcon />
            </ActionList.LeadingVisual>
            Loading reviewers
          </ActionList.Item>
          <ActionList.Item inactiveText="Review requests are temporarily unavailable">
            <ActionList.LeadingVisual>
              <PersonIcon />
            </ActionList.LeadingVisual>
            Request review
          </ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  ),
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', {name: 'Reviewers'}))
    const body = within(canvasElement.ownerDocument.body)
    await waitFor(() => expect(body.getByRole('menu')).toBeVisible())
    await userEvent.keyboard('{ArrowDown}')
    await expect(body.getByRole('menuitem', {name: 'octocat'})).toHaveFocus()
  },
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
