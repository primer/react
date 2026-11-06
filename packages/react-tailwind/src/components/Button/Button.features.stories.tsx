import {
  CommentIcon,
  DownloadIcon,
  EyeIcon,
  GearIcon,
  HeartIcon,
  InboxIcon,
  KebabHorizontalIcon,
  TriangleDownIcon,
} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {KeybindingHint} from '../KeybindingHint'
import {Stack} from '../Stack'
import {IconButton} from '../IconButton'
import {VisuallyHidden} from '../VisuallyHidden'
import {Button} from './Button'

const meta = {
  title: 'React Tailwind/Display/Button/Features',
  component: Button,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

function AccessibilityNote() {
  return (
    <>
      <p>
        <b>Accessibility note</b>: If a button is dynamically updated to communicate a change (e.g. an action was
        successful), please make sure that this is also properly communicated to screen reader users. This may not
        happen reliably without additional markup considerations. Make sure to choose an approach that is appropriate
        for your usecase.
      </p>
      <p>
        Learn more about at{' '}
        <a
          className="text-link underline"
          href="https://github.com/github/accessibility/blob/8b300b36d8bca28fd5e3e70ffa077a6f8ee65c05/docs/wiki/screen-reader-testing/dynamically-updated-buttons-support-april-2024.md"
        >
          Staff-only: Dynamically updated button labels
        </a>
        .
      </p>
    </>
  )
}

export const Primary: Story = {args: {children: 'Primary', variant: 'primary'}}
export const Danger: Story = {args: {children: 'Danger', variant: 'danger'}}
export const Invisible: Story = {args: {children: 'Invisible', variant: 'invisible'}}
export const Link: Story = {args: {children: 'Button that looks like a link', variant: 'link'}}
export const LeadingVisual: Story = {args: {children: 'Leading visual', leadingVisual: <HeartIcon />}}
export const TrailingVisual: Story = {args: {children: 'Trailing visual', trailingVisual: <EyeIcon />}}

export const NotificationIndicator: Story = {
  render: () => (
    <Stack gap="spacious">
      <Stack gap="condensed">
        <div>
          <strong>Indicator on button boundary</strong>
          <div>Use when the notification applies to the whole control.</div>
        </div>
        <Stack direction="horizontal" gap="normal">
          <IconButton icon={InboxIcon} aria-label="Inbox (new activity)" notificationIndicator="button" />
        </Stack>
      </Stack>
      <Stack gap="condensed">
        <div>
          <strong>Indicator on icon or leading visual</strong>
          <div>Use the leading visual for Button and the icon for IconButton.</div>
        </div>
        <Stack direction="horizontal" gap="normal">
          <Button
            leadingVisual={GearIcon}
            aria-label="Saved view menu (update available)"
            notificationIndicator="leadingVisual"
          >
            View
          </Button>
          <IconButton
            icon={KebabHorizontalIcon}
            aria-label="More options (new activity)"
            notificationIndicator="icon"
          />
        </Stack>
      </Stack>
    </Stack>
  ),
}

export const TrailingCounter: Story = {
  render: function TrailingCounterStory() {
    const [count, setCount] = useState(0)
    return (
      <>
        <Button count={count} onClick={() => setCount(count + 1)}>
          Watch
        </Button>
        <AccessibilityNote />
        <p>In this example, a live region has been implemented to communicate the change.</p>
      </>
    )
  },
}

export const TrailingCounterWithNoText: Story = {
  args: {
    'aria-label': 'Comments',
    count: 3,
    leadingVisual: CommentIcon,
  },
}

export const TrailingCounterWithHumanFormat: Story = {
  args: {
    'aria-label': 'Comments',
    count: '3.2k',
    leadingVisual: CommentIcon,
  },
}

export const TrailingCounterAllVariants: Story = {
  render: function TrailingCounterAllVariantsStory() {
    const [count, setCount] = useState(0)
    const onClick = () => setCount(count + 1)
    return (
      <>
        <Stack direction="horizontal" gap="normal" wrap="wrap">
          <Button count={count} onClick={onClick}>
            Watch
          </Button>
          <Button count={count} onClick={onClick}>
            Watch
          </Button>
          <Button count={count} onClick={onClick}>
            Watch
          </Button>
          <Button count={count} disabled onClick={onClick} variant="primary">
            Watch
          </Button>
          <Button count={count} onClick={onClick} variant="danger">
            Watch
          </Button>
          <Button count={count} disabled onClick={onClick} variant="danger">
            Watch
          </Button>
          <Button count={count} onClick={onClick} variant="invisible">
            Watch
          </Button>
          <Button count={count} disabled onClick={onClick} variant="invisible">
            Watch
          </Button>
        </Stack>
        <AccessibilityNote />
        <p>In these examples, a live region has been implemented to communicate the change.</p>
      </>
    )
  },
}

export const TrailingAction: Story = {
  args: {children: 'Trailing action', trailingAction: TriangleDownIcon},
}

export const Block: Story = {args: {children: 'Default', block: true}}

export const Disabled: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button disabled>Default</Button>
      <Button disabled variant="primary">
        Primary
      </Button>
      <Button disabled variant="danger">
        Danger
      </Button>
      <Button disabled variant="invisible">
        Invisible
      </Button>
    </div>
  ),
}

export const Inactive: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <VisuallyHidden id="inactive-state">Inactive</VisuallyHidden>
      <Button aria-describedby="inactive-state" inactive>
        Default
      </Button>
      <Button aria-describedby="inactive-state" inactive variant="primary">
        Primary
      </Button>
      <Button aria-describedby="inactive-state" inactive variant="danger">
        Danger
      </Button>
      <Button aria-describedby="inactive-state" inactive variant="invisible">
        Invisible
      </Button>
    </div>
  ),
}

export const Small: Story = {args: {children: 'Default', size: 'small'}}
export const Medium: Story = {args: {children: 'Default', size: 'medium'}}
export const Large: Story = {args: {children: 'Default', size: 'large'}}
export const Loading: Story = {
  render: () => (
    <div className="flex flex-row gap-4">
      <Button loading>Default</Button>
      <Button variant="primary" loading>
        Primary
      </Button>
      <Button variant="danger" loading>
        Danger
      </Button>
      <Button variant="invisible" loading>
        Invisible
      </Button>
    </div>
  ),
}
export const LoadingCustomAnnouncement: Story = {
  args: {children: 'Default', loading: true, loadingAnnouncement: 'This is a custom loading announcement'},
}
export const LoadingWithLeadingVisual: Story = {
  args: {children: 'Export', leadingVisual: <DownloadIcon />, loading: true},
}
export const LoadingWithTrailingVisual: Story = {
  args: {children: 'Export', trailingVisual: <DownloadIcon />, loading: true},
}
export const LoadingWithTrailingAction: Story = {
  args: {children: 'Export dropdown', trailingAction: TriangleDownIcon, loading: true},
}

function LoadingTriggerStory() {
  const [loading, setLoading] = useState(false)
  return (
    <Button leadingVisual={<DownloadIcon />} loading={loading} onClick={() => setLoading(true)}>
      Export
    </Button>
  )
}

export const LoadingTrigger: Story = {render: LoadingTriggerStory}

export const LoadingTriggerInteractive: Story = {
  render: LoadingTriggerStory,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', {name: 'Export'}))
    await expect(canvas.getByRole('button', {name: /Export/})).toHaveAttribute('aria-busy', 'true')
  },
}

export const LabelWrap: Story = {
  render: () => (
    <Stack className="w-[200px]">
      <Button labelWrap>This button label will wrap if the label is too long</Button>
      <Button labelWrap size="small">
        This small button label will wrap if the label is too long
      </Button>
      <Button labelWrap size="large">
        This large button label will wrap if the label is too long
      </Button>
      <Button labelWrap leadingVisual={HeartIcon} trailingVisual={EyeIcon}>
        This button label will wrap if the label is too long
      </Button>
    </Stack>
  ),
}

export const InactiveButtonWithTooltip: Story = {
  args: {
    children: 'Review changes',
    inactive: true,
    title: 'Action unavailable: an error occurred while loading repository permissions',
  },
}

export const ExpandedButton: Story = {
  render: () => (
    <Stack align="start">
      <Button aria-expanded trailingAction={TriangleDownIcon}>
        Review changes
      </Button>
      <Button aria-expanded variant="primary" trailingAction={TriangleDownIcon}>
        Review changes
      </Button>
      <Button aria-expanded variant="invisible" trailingAction={TriangleDownIcon}>
        Review changes
      </Button>
      <Button aria-expanded variant="danger" trailingAction={TriangleDownIcon}>
        Review changes
      </Button>
    </Stack>
  ),
}

export const KeybindingHintBasic: Story = {
  args: {children: 'Save', trailingVisual: <KeybindingHint keys="Mod+S" />},
}
export const KeybindingHintAllVariants: Story = {
  render: () => (
    <Stack>
      <Stack direction="horizontal" gap="normal" wrap="wrap">
        <Button trailingVisual={<KeybindingHint keys="Mod+S" />}>Default</Button>
        <Button disabled trailingVisual={<KeybindingHint keys="Mod+S" />}>
          Default disabled
        </Button>
        <Button inactive trailingVisual={<KeybindingHint keys="Mod+S" />}>
          Default inactive
        </Button>
      </Stack>
      <Stack direction="horizontal" gap="normal" wrap="wrap">
        <Button variant="primary" trailingVisual={<KeybindingHint keys="Mod+S" variant="onEmphasis" />}>
          Primary
        </Button>
        <Button variant="primary" disabled trailingVisual={<KeybindingHint keys="Mod+S" variant="onEmphasis" />}>
          Primary disabled
        </Button>
        <Button variant="primary" inactive trailingVisual={<KeybindingHint keys="Mod+S" variant="onEmphasis" />}>
          Primary inactive
        </Button>
      </Stack>
      <Stack direction="horizontal" gap="normal" wrap="wrap">
        <Button variant="danger" trailingVisual={<KeybindingHint keys="Mod+S" variant="onEmphasis" />}>
          Danger
        </Button>
        <Button variant="danger" disabled trailingVisual={<KeybindingHint keys="Mod+S" variant="onEmphasis" />}>
          Danger disabled
        </Button>
        <Button variant="danger" inactive trailingVisual={<KeybindingHint keys="Mod+S" variant="onEmphasis" />}>
          Danger inactive
        </Button>
      </Stack>
      <Stack direction="horizontal" gap="normal" wrap="wrap">
        <Button variant="invisible" trailingVisual={<KeybindingHint keys="Mod+S" />}>
          Invisible
        </Button>
        <Button variant="invisible" disabled trailingVisual={<KeybindingHint keys="Mod+S" />}>
          Invisible disabled
        </Button>
        <Button variant="invisible" inactive trailingVisual={<KeybindingHint keys="Mod+S" />}>
          Invisible inactive
        </Button>
      </Stack>
    </Stack>
  ),
}
export const KeybindingHintAllSizes: Story = {
  render: () => (
    <Stack direction="horizontal" gap="normal" wrap="wrap">
      <Button size="small" trailingVisual={<KeybindingHint keys="Mod+S" size="small" />}>
        Save
      </Button>
      <Button size="medium" trailingVisual={<KeybindingHint keys="Mod+S" />}>
        Save
      </Button>
      <Button size="large" trailingVisual={<KeybindingHint keys="Mod+S" />}>
        Save
      </Button>
    </Stack>
  ),
}
export const KeybindingHintWithLeadingVisual: Story = {
  args: {children: 'Download', leadingVisual: DownloadIcon, trailingVisual: <KeybindingHint keys="Mod+D" />},
}
export const KeybindingHintSequence: Story = {
  args: {
    children: 'Go to notifications',
    variant: 'primary',
    trailingVisual: <KeybindingHint keys="G N" variant="onEmphasis" />,
  },
}
function KeybindingHintWithLoadingStory() {
  const [loading, setLoading] = useState(false)
  return (
    <Button
      loading={loading}
      onClick={() => setLoading(true)}
      trailingVisual={<KeybindingHint keys="Mod+Enter" variant="onEmphasis" />}
      variant="primary"
    >
      Submit
    </Button>
  )
}

export const KeybindingHintWithLoading: Story = {render: KeybindingHintWithLoadingStory}

export const KeybindingHintWithLoadingInteractive: Story = {
  render: KeybindingHintWithLoadingStory,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', {name: /^Submit/}))
    await expect(canvas.getByRole('button', {name: /Submit/})).toHaveAttribute('aria-busy', 'true')
  },
}
