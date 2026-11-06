import React from 'react'
import {ArchiveIcon, CopyIcon, GearIcon, SparkleFillIcon, WorkflowIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {ActionMenu} from './ActionMenu'
import {GitHubProjectsGroup, ProjectActions} from './ActionMenu.storyHelpers'

const meta = {
  title: 'React Tailwind/Components/ActionMenu/Features',
  component: ActionMenu,
} satisfies Meta<typeof ActionMenu>

export default meta
type Story = StoryObj<typeof meta>

const notifyClicked = (name: string) => alert(`${name} clicked`)

export const LinksAndActions: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Open menu</ActionMenu.Button>
      <ActionMenu.Content width="auto">
        <ProjectActions />
        <GitHubProjectsGroup heading="GitHub projects" />
      </ActionMenu.Content>
    </ActionMenu>
  ),
}

const mergeOptions = ['Fast forward', 'Recursive', 'Ours', 'Octopus', 'Resolve', 'Subtree']

export const SingleSelect: Story = {
  render: function SingleSelectExample() {
    const [selected, setSelected] = React.useState(mergeOptions[0])
    return (
      <ActionMenu>
        <ActionMenu.Button>
          <span className="inline-block text-muted">Options:</span> {selected}
        </ActionMenu.Button>
        <ActionMenu.Content width="auto">
          <ActionMenu.RadioGroup value={selected} onValueChange={setSelected}>
            {mergeOptions.map(option => (
              <ActionMenu.RadioItem key={option} value={option}>
                {option}
              </ActionMenu.RadioItem>
            ))}
          </ActionMenu.RadioGroup>
        </ActionMenu.Content>
      </ActionMenu>
    )
  },
}

const displayOptions = ['Show code folding buttons', 'Wrap lines', 'Center content']

export const MultiSelect: Story = {
  render: function MultiSelectExample() {
    const [selected, setSelected] = React.useState<ReadonlySet<string>>(() => new Set([displayOptions[0]]))
    const toggle = (option: string, checked: boolean) =>
      setSelected(current => {
        const next = new Set(current)
        if (checked) next.add(option)
        else next.delete(option)
        return next
      })
    return (
      <ActionMenu>
        <ActionMenu.Button>Display</ActionMenu.Button>
        <ActionMenu.Content width="auto">
          {displayOptions.map(option => (
            <ActionMenu.CheckboxItem
              key={option}
              checked={selected.has(option)}
              onCheckedChange={checked => toggle(option, checked)}
            >
              {option}
            </ActionMenu.CheckboxItem>
          ))}
        </ActionMenu.Content>
      </ActionMenu>
    )
  },
}

export const InactiveItems: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Open menu</ActionMenu.Button>
      <ActionMenu.Content width="auto">
        <ProjectActions inactiveText="Unavailable due to an outage" />
        <GitHubProjectsGroup heading="Github projects" />
      </ActionMenu.Content>
    </ActionMenu>
  ),
}

export const LoadingItems: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Open menu</ActionMenu.Button>
      <ActionMenu.Content width="auto">
        <ActionMenu.Item loading onClick={() => notifyClicked('Workflows')}>
          <ActionMenu.LeadingVisual>
            <WorkflowIcon />
          </ActionMenu.LeadingVisual>
          Workflows
        </ActionMenu.Item>
        <ActionMenu.Item loading onClick={() => notifyClicked('Archived items')}>
          <ActionMenu.LeadingVisual>
            <ArchiveIcon />
          </ActionMenu.LeadingVisual>
          Archived items
        </ActionMenu.Item>
        <ActionMenu.Item loading onClick={() => notifyClicked('Make a copy')}>
          <ActionMenu.LeadingVisual>
            <CopyIcon />
          </ActionMenu.LeadingVisual>
          Make a copy
        </ActionMenu.Item>
        <GitHubProjectsGroup heading="Github projects" />
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
          <ActionMenu.Content>
            <ActionMenu.Item>Paste plain text</ActionMenu.Item>
            <ActionMenu.Item>Paste formulas</ActionMenu.Item>
            <ActionMenu.Item>Paste with formatting</ActionMenu.Item>
            <ActionMenu.Submenu>
              <ActionMenu.SubmenuTrigger>Paste from</ActionMenu.SubmenuTrigger>
              <ActionMenu.Content>
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
      <ActionMenu.Content width="auto">
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
        <ActionMenu.LinkItem href="/">
          <ActionMenu.LeadingVisual>
            <GearIcon />
          </ActionMenu.LeadingVisual>
          Settings
        </ActionMenu.LinkItem>
        <ActionMenu.Item disabled>
          <ActionMenu.LeadingVisual>
            <CopyIcon />
          </ActionMenu.LeadingVisual>
          Make a copy
        </ActionMenu.Item>
        <GitHubProjectsGroup heading="Github projects" />
      </ActionMenu.Content>
    </ActionMenu>
  ),
}
