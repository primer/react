import React from 'react'
import {
  ArchiveIcon,
  BookIcon,
  CommentIcon,
  CopyIcon,
  GearIcon,
  RocketIcon,
  SparkleFillIcon,
  WorkflowIcon,
} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {ActionMenu} from './ActionMenu'

const meta = {
  title: 'React Tailwind/Components/ActionMenu/Features',
  component: ActionMenu,
} satisfies Meta<typeof ActionMenu>

export default meta
type Story = StoryObj<typeof meta>

// eslint-disable-next-line jsx-a11y/anchor-has-content -- ActionMenu.Item supplies the rendered anchor's content.
const linkRenderer = <a href="/" />

export const LinksAndActions: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Open menu</ActionMenu.Button>
      <ActionMenu.Content>
        <ActionMenu.Item>
          <ActionMenu.LeadingVisual>
            <WorkflowIcon />
          </ActionMenu.LeadingVisual>
          Workflows
        </ActionMenu.Item>
        <ActionMenu.Item>
          <ActionMenu.LeadingVisual>
            <ArchiveIcon />
          </ActionMenu.LeadingVisual>
          Archived items
        </ActionMenu.Item>
        <ActionMenu.Item render={linkRenderer}>
          <ActionMenu.LeadingVisual>
            <GearIcon />
          </ActionMenu.LeadingVisual>
          Settings
        </ActionMenu.Item>
        <ActionMenu.Item>
          <ActionMenu.LeadingVisual>
            <CopyIcon />
          </ActionMenu.LeadingVisual>
          Make a copy
        </ActionMenu.Item>
        <ActionMenu.Divider />
        <ActionMenu.Group>
          <ActionMenu.GroupLabel>GitHub projects</ActionMenu.GroupLabel>
          <ActionMenu.Item render={linkRenderer}>
            <ActionMenu.LeadingVisual>
              <RocketIcon />
            </ActionMenu.LeadingVisual>
            What&apos;s new
          </ActionMenu.Item>
          <ActionMenu.Item render={linkRenderer}>
            <ActionMenu.LeadingVisual>
              <CommentIcon />
            </ActionMenu.LeadingVisual>
            Give feedback
          </ActionMenu.Item>
          <ActionMenu.Item render={linkRenderer}>
            <ActionMenu.LeadingVisual>
              <BookIcon />
            </ActionMenu.LeadingVisual>
            GitHub Docs
          </ActionMenu.Item>
        </ActionMenu.Group>
      </ActionMenu.Content>
    </ActionMenu>
  ),
}

export const SingleSelect: Story = {
  render: () => {
    const options = ['Fast forward', 'Recursive', 'Ours', 'Octopus', 'Resolve', 'Subtree']
    const [selected, setSelected] = React.useState(options[0])
    return (
      <ActionMenu>
        <ActionMenu.Button>
          <span className="text-muted">Options:</span> {selected}
        </ActionMenu.Button>
        <ActionMenu.Content>
          {options.map(option => (
            <ActionMenu.Item key={option} onClick={() => setSelected(option)} selected={option === selected}>
              {option}
            </ActionMenu.Item>
          ))}
        </ActionMenu.Content>
      </ActionMenu>
    )
  },
}

export const MultiSelect: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Display</ActionMenu.Button>
      <ActionMenu.Content>
        <ActionMenu.CheckboxItem checked>Show code folding buttons</ActionMenu.CheckboxItem>
        <ActionMenu.CheckboxItem>Wrap lines</ActionMenu.CheckboxItem>
        <ActionMenu.CheckboxItem>Center content</ActionMenu.CheckboxItem>
      </ActionMenu.Content>
    </ActionMenu>
  ),
}

export const InactiveItems: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Open menu</ActionMenu.Button>
      <ActionMenu.Content>
        <ActionMenu.Item inactiveText="Unavailable due to an outage">
          <ActionMenu.LeadingVisual>
            <WorkflowIcon />
          </ActionMenu.LeadingVisual>
          Workflows
        </ActionMenu.Item>
        <ActionMenu.Item inactiveText="Unavailable due to an outage">
          <ActionMenu.LeadingVisual>
            <ArchiveIcon />
          </ActionMenu.LeadingVisual>
          Archived items
        </ActionMenu.Item>
        <ActionMenu.Item inactiveText="Unavailable due to an outage">
          <ActionMenu.LeadingVisual>
            <GearIcon />
          </ActionMenu.LeadingVisual>
          Settings
        </ActionMenu.Item>
        <ActionMenu.Item inactiveText="Unavailable due to an outage">
          <ActionMenu.LeadingVisual>
            <CopyIcon />
          </ActionMenu.LeadingVisual>
          Make a copy
        </ActionMenu.Item>
      </ActionMenu.Content>
    </ActionMenu>
  ),
}

export const LoadingItems: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Open menu</ActionMenu.Button>
      <ActionMenu.Content>
        <ActionMenu.Item loading>
          <ActionMenu.LeadingVisual>
            <WorkflowIcon />
          </ActionMenu.LeadingVisual>
          Workflows
        </ActionMenu.Item>
        <ActionMenu.Item loading>
          <ActionMenu.LeadingVisual>
            <ArchiveIcon />
          </ActionMenu.LeadingVisual>
          Archived items
        </ActionMenu.Item>
        <ActionMenu.Item loading>
          <ActionMenu.LeadingVisual>
            <CopyIcon />
          </ActionMenu.LeadingVisual>
          Make a copy
        </ActionMenu.Item>
      </ActionMenu.Content>
    </ActionMenu>
  ),
}

export const Submenus: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Edit</ActionMenu.Button>
      <ActionMenu.Content>
        <ActionMenu.Item>Cut</ActionMenu.Item>
        <ActionMenu.Item>Copy</ActionMenu.Item>
        <ActionMenu.Item>Paste</ActionMenu.Item>
        <ActionMenu.Submenu>
          <ActionMenu.SubmenuTrigger>
            <ActionMenu.LeadingVisual>
              <SparkleFillIcon />
            </ActionMenu.LeadingVisual>
            Paste special
          </ActionMenu.SubmenuTrigger>
          <ActionMenu.Content side="right">
            <ActionMenu.Item>Paste plain text</ActionMenu.Item>
            <ActionMenu.Item>Paste formulas</ActionMenu.Item>
            <ActionMenu.Submenu>
              <ActionMenu.SubmenuTrigger>Paste with formatting</ActionMenu.SubmenuTrigger>
              <ActionMenu.Content side="right">
                <ActionMenu.Item>Current clipboard</ActionMenu.Item>
                <ActionMenu.Item>History</ActionMenu.Item>
                <ActionMenu.Item>Another device</ActionMenu.Item>
              </ActionMenu.Content>
            </ActionMenu.Submenu>
          </ActionMenu.Content>
        </ActionMenu.Submenu>
      </ActionMenu.Content>
    </ActionMenu>
  ),
}

export const DisabledItems: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Open menu</ActionMenu.Button>
      <ActionMenu.Content>
        <ActionMenu.Item disabled>
          <ActionMenu.LeadingVisual>
            <WorkflowIcon />
          </ActionMenu.LeadingVisual>
          Workflows
        </ActionMenu.Item>
        <ActionMenu.Item>
          <ActionMenu.LeadingVisual>
            <ArchiveIcon />
          </ActionMenu.LeadingVisual>
          Archived items
        </ActionMenu.Item>
        <ActionMenu.Item render={linkRenderer}>
          <ActionMenu.LeadingVisual>
            <GearIcon />
          </ActionMenu.LeadingVisual>
          Settings
        </ActionMenu.Item>
        <ActionMenu.Item disabled>
          <ActionMenu.LeadingVisual>
            <CopyIcon />
          </ActionMenu.LeadingVisual>
          Make a copy
        </ActionMenu.Item>
      </ActionMenu.Content>
    </ActionMenu>
  ),
}
