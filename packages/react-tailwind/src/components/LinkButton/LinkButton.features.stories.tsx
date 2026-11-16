import {ChevronRightIcon, DownloadIcon, EyeIcon, HeartIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {LinkButton} from './LinkButton'

const meta = {title: 'React Tailwind/Components/LinkButton/Features', component: LinkButton} satisfies Meta<
  typeof LinkButton
>
export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {args: {children: 'Primary', href: '#', variant: 'primary'}}
export const Danger: Story = {args: {children: 'Danger', href: '#', variant: 'danger'}}
export const Invisible: Story = {args: {children: 'Invisible', href: '#', variant: 'invisible'}}
export const Link: Story = {args: {children: 'Button that looks like a link', href: '#', variant: 'link'}}
export const LeadingVisual: Story = {args: {children: 'Leading visual', href: '#', leadingVisual: <HeartIcon />}}
export const TrailingVisual: Story = {args: {children: 'Trailing visual', href: '#', trailingVisual: <EyeIcon />}}
export const TrailingAction: Story = {
  args: {children: 'Trailing action', href: '#', trailingAction: <ChevronRightIcon />},
}
export const Block: Story = {args: {children: 'Default', href: '#', block: true}}
export const Small: Story = {args: {children: 'Default', href: '#', size: 'small'}}
export const Medium: Story = {args: {children: 'Default', href: '#', size: 'medium'}}
export const Large: Story = {args: {children: 'Default', href: '#', size: 'large'}}
export const WithReactRouter: Story = {
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  args: {children: 'Default', render: <a href="/dummy" />},
}
export const Loading: Story = {args: {children: 'Default', loading: true}}
export const LoadingCustomAnnouncement: Story = {
  args: {children: 'Default', href: '#', loading: true, loadingAnnouncement: 'This is a custom loading announcement'},
}
export const LoadingWithLeadingVisual: Story = {
  args: {children: 'Export', href: '#', loading: true, leadingVisual: <DownloadIcon />},
}
export const LoadingWithTrailingVisual: Story = {
  args: {children: 'Export', href: '#', loading: true, trailingVisual: <DownloadIcon />},
}
