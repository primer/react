import {BoldIcon, DownloadIcon, HeartIcon, InboxIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {IconButton} from './IconButton'

const meta = {
  title: 'React Tailwind/Components/IconButton/Features',
  component: IconButton,
  args: {icon: HeartIcon, 'aria-label': 'Favorite'},
} satisfies Meta<typeof IconButton>
export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {args: {icon: HeartIcon, variant: 'primary', 'aria-label': 'Favorite'}}
export const Danger: Story = {args: {icon: HeartIcon, variant: 'danger', 'aria-label': 'Favorite'}}
export const Invisible: Story = {args: {icon: HeartIcon, variant: 'invisible', 'aria-label': 'Favorite'}}
export const Disabled: Story = {args: {disabled: true, icon: HeartIcon, 'aria-label': 'Favorite'}}
export const Small: Story = {args: {size: 'small', icon: HeartIcon, 'aria-label': 'Favorite'}}
export const Medium: Story = {args: {size: 'medium', icon: HeartIcon, 'aria-label': 'Favorite'}}
export const Large: Story = {args: {size: 'large', icon: HeartIcon, 'aria-label': 'Favorite'}}
export const WithDescription: Story = {
  args: {icon: InboxIcon, 'aria-label': 'Notifications', title: 'You have no unread notifications.'},
}
export const ExternalTooltip: Story = {
  args: {icon: HeartIcon, 'aria-label': 'HeartIcon', title: 'this is a supportive description for icon button'},
}
export const AsAMenuAnchor: Story = {args: {icon: HeartIcon, 'aria-label': 'Something', 'aria-haspopup': 'menu'}}
export const Loading: Story = {args: {loading: true, icon: HeartIcon, variant: 'primary', 'aria-label': 'Primary'}}
export const LoadingTrigger: Story = {
  render: function LoadingTriggerStory() {
    const [loading, setLoading] = useState(false)
    return <IconButton icon={DownloadIcon} loading={loading} onClick={() => setLoading(true)} aria-label="Download" />
  },
}
export const KeybindingHintOnDescription: Story = {
  args: {icon: InboxIcon, 'aria-label': 'Notifications', title: 'You have unread notifications (G+N)'},
}
export const KeybindingHint: Story = {args: {icon: BoldIcon, 'aria-label': 'Bold', title: 'Mod+B'}}
export const MultipleKeybindingHints: Story = {args: {icon: BoldIcon, 'aria-label': 'Bold', title: 'Mod+B, Control+B'}}
export const LongDelayedTooltip: Story = {
  args: {icon: HeartIcon, 'aria-label': 'HeartIcon', title: 'This is a tooltip with 1200ms delay'},
}
