import React from 'react'
import {DownloadIcon, HeartIcon, PlusIcon, SearchIcon, StarIcon, TriangleDownIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {fn} from 'storybook/test'

import {Button} from '.'
// import {Avatar} from '../avatar'

const leadingVisualOptions = {
  None: undefined,
  'Heart Icon': <HeartIcon size={16} />,
  'Star Icon': <StarIcon size={16} />,
  'Search Icon': <SearchIcon size={16} />,
  'Plus Icon': <PlusIcon size={16} />,
  'Download Icon': <DownloadIcon size={16} />,
  // Avatar: <Avatar src="https://avatars.githubusercontent.com/u/1?v=4" size={20} fullName="Monalisa Octocat" />,
  // 'Avatar (Initials)': <Avatar size={20} fullName="John Doe" />,
}

const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'danger', 'invisible', 'link'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    block: {
      control: 'boolean',
    },
    inactive: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    leadingVisual: {
      control: 'select',
      options: Object.keys(leadingVisualOptions),
      mapping: leadingVisualOptions,
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary button',
  },
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger button',
  },
}

export const Invisible: Story = {
  args: {
    variant: 'invisible',
    children: 'Invisible button',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link button',
  },
}

export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small button',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large button',
  },
}

export const WithLeadingVisual: Story = {
  args: {
    leadingVisual: <HeartIcon size={16} />,
    children: 'Like',
  },
}

export const WithTrailingVisual: Story = {
  args: {
    trailingVisual: <TriangleDownIcon size={16} />,
    children: 'Dropdown',
  },
}

export const WithBothVisuals: Story = {
  args: {
    leadingVisual: <StarIcon size={16} />,
    trailingVisual: <TriangleDownIcon size={16} />,
    children: 'Star',
  },
}

export const Block: Story = {
  args: {
    block: true,
    children: 'Full width button',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled button',
  },
}

export const Inactive: Story = {
  args: {
    inactive: true,
    children: 'Inactive button',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button variant="default">Default</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="invisible">Invisible</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex gap-2">
        <Button size="small">Small</Button>
        <Button size="medium">Medium</Button>
        <Button size="large">Large</Button>
      </div>
      <div className="flex gap-2">
        <Button leadingVisual={<DownloadIcon size={16} />}>Download</Button>
        <Button trailingVisual={<TriangleDownIcon size={16} />}>Options</Button>
      </div>
    </div>
  ),
}
