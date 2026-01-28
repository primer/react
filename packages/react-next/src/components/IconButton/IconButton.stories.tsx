import React from 'react'
import {
  BellIcon,
  CodeIcon,
  DownloadIcon,
  GearIcon,
  HeartIcon,
  InboxIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SyncIcon,
  TrashIcon,
  XIcon,
} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'

import {IconButton} from '.'

const meta: Meta<typeof IconButton> = {
  title: 'Components/Icon Button',
  component: IconButton,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'danger', 'invisible'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    loading: {
      control: 'boolean',
    },
    inactive: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: <HeartIcon />,
    'aria-label': 'Favorite',
  },
}

export const Primary: Story = {
  args: {
    icon: <PlusIcon />,
    'aria-label': 'Add item',
    variant: 'primary',
  },
}

export const Danger: Story = {
  args: {
    icon: <TrashIcon />,
    'aria-label': 'Delete',
    variant: 'danger',
  },
}

export const Invisible: Story = {
  args: {
    icon: <XIcon />,
    'aria-label': 'Close',
    variant: 'invisible',
  },
}

export const Small: Story = {
  args: {
    icon: <GearIcon />,
    'aria-label': 'Settings',
    size: 'small',
  },
}

export const Medium: Story = {
  args: {
    icon: <GearIcon />,
    'aria-label': 'Settings',
    size: 'medium',
  },
}

export const Large: Story = {
  args: {
    icon: <GearIcon />,
    'aria-label': 'Settings',
    size: 'large',
  },
}

export const Loading: Story = {
  args: {
    icon: <SyncIcon />,
    'aria-label': 'Sync',
    loading: true,
  },
}

export const LoadingPrimary: Story = {
  args: {
    icon: <SyncIcon />,
    'aria-label': 'Sync',
    loading: true,
    variant: 'primary',
  },
}

export const Inactive: Story = {
  args: {
    icon: <HeartIcon />,
    'aria-label': 'Favorite',
    inactive: true,
  },
}

export const Disabled: Story = {
  args: {
    icon: <HeartIcon />,
    'aria-label': 'Favorite',
    disabled: true,
  },
}

export const AllVariants: Story = {
  args: {
    icon: <HeartIcon />,
    'aria-label': 'Favorite',
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-2 text-body-small font-semibold text-default">Variants</h3>
        <div className="flex gap-2">
          <IconButton icon={<HeartIcon />} aria-label="Default" variant="default" />
          <IconButton icon={<PlusIcon />} aria-label="Primary" variant="primary" />
          <IconButton icon={<TrashIcon />} aria-label="Danger" variant="danger" />
          <IconButton icon={<XIcon />} aria-label="Invisible" variant="invisible" />
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-body-small font-semibold text-default">Sizes</h3>
        <div className="flex items-center gap-2">
          <IconButton icon={<GearIcon />} aria-label="Small" size="small" />
          <IconButton icon={<GearIcon />} aria-label="Medium" size="medium" />
          <IconButton icon={<GearIcon />} aria-label="Large" size="large" />
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-body-small font-semibold text-default">States</h3>
        <div className="flex gap-2">
          <IconButton icon={<HeartIcon />} aria-label="Default" />
          <IconButton icon={<HeartIcon />} aria-label="Inactive" inactive />
          <IconButton icon={<HeartIcon />} aria-label="Disabled" disabled />
          <IconButton icon={<SyncIcon />} aria-label="Loading" loading />
        </div>
      </div>
    </div>
  ),
}

export const CommonUseCases: Story = {
  args: {
    icon: <HeartIcon />,
    'aria-label': 'Favorite',
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-2 text-body-small font-semibold text-default">Navigation & Actions</h3>
        <div className="flex gap-2">
          <IconButton icon={<SearchIcon />} aria-label="Search" />
          <IconButton icon={<BellIcon />} aria-label="Notifications" />
          <IconButton icon={<InboxIcon />} aria-label="Inbox" />
          <IconButton icon={<GearIcon />} aria-label="Settings" />
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-body-small font-semibold text-default">Editor Actions</h3>
        <div className="flex gap-2">
          <IconButton icon={<PencilIcon />} aria-label="Edit" />
          <IconButton icon={<CodeIcon />} aria-label="View code" />
          <IconButton icon={<DownloadIcon />} aria-label="Download" />
          <IconButton icon={<TrashIcon />} aria-label="Delete" variant="danger" />
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-body-small font-semibold text-default">Dialog Actions</h3>
        <div className="flex gap-2">
          <IconButton icon={<XIcon />} aria-label="Close dialog" variant="invisible" />
        </div>
      </div>
    </div>
  ),
}

export const SizeComparison: Story = {
  args: {
    icon: <HeartIcon />,
    'aria-label': 'Favorite',
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {(['default', 'primary', 'danger', 'invisible'] as const).map(variant => (
        <div key={variant} className="flex items-center gap-4">
          <span className="w-20 text-body-small text-muted capitalize">{variant}</span>
          <div className="flex items-center gap-2">
            <IconButton icon={<HeartIcon />} aria-label={`${variant} small`} variant={variant} size="small" />
            <IconButton icon={<HeartIcon />} aria-label={`${variant} medium`} variant={variant} size="medium" />
            <IconButton icon={<HeartIcon />} aria-label={`${variant} large`} variant={variant} size="large" />
          </div>
        </div>
      ))}
    </div>
  ),
}

export const WithDescription: Story = {
  args: {
    icon: <BellIcon />,
    'aria-label': 'Notifications',
    description: 'You have unread notifications',
  },
}

export const TooltipDirections: Story = {
  args: {
    icon: <HeartIcon />,
    'aria-label': 'Favorite',
  },
  render: () => (
    <div className="flex items-center justify-center p-16">
      <div className="grid grid-cols-3 gap-4">
        <div />
        <IconButton icon={<GearIcon />} aria-label="Top" description="Tooltip on top" side="top" />
        <div />
        <IconButton icon={<GearIcon />} aria-label="Left" description="Tooltip on left" side="left" />
        <div className="flex items-center justify-center">
          <span className="text-body-small text-muted">Hover buttons</span>
        </div>
        <IconButton icon={<GearIcon />} aria-label="Right" description="Tooltip on right" side="right" />
        <div />
        <IconButton icon={<GearIcon />} aria-label="Bottom" description="Tooltip on bottom" side="bottom" />
        <div />
      </div>
    </div>
  ),
}

export const WithDescriptionVariants: Story = {
  args: {
    icon: <HeartIcon />,
    'aria-label': 'Favorite',
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-2 text-body-small font-semibold text-default">Hover to see tooltips</h3>
        <div className="flex gap-4">
          <IconButton icon={<BellIcon />} aria-label="Notifications" description="You have 5 unread notifications" />
          <IconButton icon={<InboxIcon />} aria-label="Inbox" description="Open your inbox" />
          <IconButton icon={<GearIcon />} aria-label="Settings" description="Open settings" />
          <IconButton icon={<SearchIcon />} aria-label="Search" description="Search the repository" />
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-body-small font-semibold text-default">Different variants with descriptions</h3>
        <div className="flex gap-4">
          <IconButton icon={<PlusIcon />} aria-label="Add" description="Create new item" variant="primary" />
          <IconButton
            icon={<TrashIcon />}
            aria-label="Delete"
            description="Delete this item permanently"
            variant="danger"
          />
          <IconButton icon={<XIcon />} aria-label="Close" description="Close this panel" variant="invisible" />
        </div>
      </div>
    </div>
  ),
}
