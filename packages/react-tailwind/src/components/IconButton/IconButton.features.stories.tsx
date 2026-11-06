import {BoldIcon, ChevronDownIcon, DownloadIcon, HeartIcon, InboxIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {ActionMenu} from '../ActionMenu'
import {Tooltip} from '../Tooltip'
import {IconButton} from './IconButton'

const meta = {
  title: 'React Tailwind/Components/IconButton/Features',
  component: IconButton,
  args: {icon: <HeartIcon />, 'aria-label': 'Favorite'},
} satisfies Meta<typeof IconButton>
export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {args: {icon: <HeartIcon />, variant: 'primary', 'aria-label': 'Favorite'}}
export const Danger: Story = {args: {icon: <HeartIcon />, variant: 'danger', 'aria-label': 'Favorite'}}
export const Invisible: Story = {args: {icon: <HeartIcon />, variant: 'invisible', 'aria-label': 'Favorite'}}
export const Disabled: Story = {args: {disabled: true, icon: <HeartIcon />, 'aria-label': 'Favorite'}}
export const Small: Story = {args: {size: 'small', icon: <HeartIcon />, 'aria-label': 'Favorite'}}
export const Medium: Story = {args: {size: 'medium', icon: <HeartIcon />, 'aria-label': 'Favorite'}}
export const Large: Story = {args: {size: 'large', icon: <HeartIcon />, 'aria-label': 'Favorite'}}
export const WithDescription: Story = {
  args: {icon: <InboxIcon />, 'aria-label': 'Notifications', description: 'You have no unread notifications.'},
}
export const ExternalTooltip: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger render={<IconButton icon={<HeartIcon />} aria-label="HeartIcon" />} />
      <Tooltip.Content align="end" side="bottom">
        this is a supportive description for icon button
      </Tooltip.Content>
    </Tooltip>
  ),
}
export const AsAMenuAnchor: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Trigger render={<IconButton icon={<ChevronDownIcon />} aria-label="Something" />} />
      <ActionMenu.Content className="w-80">
        <ActionMenu.Item>
          Copy link
          <ActionMenu.TrailingVisual>⌘C</ActionMenu.TrailingVisual>
        </ActionMenu.Item>
        <ActionMenu.Item>
          Quote reply
          <ActionMenu.TrailingVisual>⌘Q</ActionMenu.TrailingVisual>
        </ActionMenu.Item>
        <ActionMenu.Item>
          Edit comment
          <ActionMenu.TrailingVisual>⌘E</ActionMenu.TrailingVisual>
        </ActionMenu.Item>
        <ActionMenu.Divider />
        <ActionMenu.Item variant="danger">
          Delete file
          <ActionMenu.TrailingVisual>⌘D</ActionMenu.TrailingVisual>
        </ActionMenu.Item>
      </ActionMenu.Content>
    </ActionMenu>
  ),
}
export const Loading: Story = {args: {loading: true, icon: <HeartIcon />, variant: 'primary', 'aria-label': 'Primary'}}
export const LoadingTrigger: Story = {
  render: function LoadingTriggerStory() {
    const [loading, setLoading] = useState(false)
    return (
      <IconButton icon={<DownloadIcon />} loading={loading} onClick={() => setLoading(true)} aria-label="Download" />
    )
  },
}
export const KeybindingHintOnDescription: Story = {
  args: {
    icon: <InboxIcon />,
    'aria-label': 'Notifications',
    description: 'You have unread notifications',
    keybindingHint: 'G+N',
  },
}
export const KeybindingHint: Story = {args: {icon: <BoldIcon />, 'aria-label': 'Bold', keybindingHint: 'Mod+B'}}
export const MultipleKeybindingHints: Story = {
  args: {icon: <BoldIcon />, 'aria-label': 'Bold', keybindingHint: ['Mod+B', 'Control+B']},
}
export const LongDelayedTooltip: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger delay={1200} render={<IconButton icon={<HeartIcon />} aria-label="HeartIcon" />} />
      <Tooltip.Content side="bottom">This is a tooltip with 1200ms delay</Tooltip.Content>
    </Tooltip>
  ),
}
