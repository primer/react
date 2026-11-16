import type {Meta, StoryObj} from '@storybook/react-vite'
import {VisuallyHidden} from '../VisuallyHidden'
import {StateLabel} from './StateLabel'

const meta = {title: 'React Tailwind/Display/StateLabel/Features', component: StateLabel} satisfies Meta<
  typeof StateLabel
>
export default meta
type Story = StoryObj<typeof meta>
export const IssueOpened: Story = {args: {status: 'issueOpened', children: 'Open'}}
export const IssueClosed: Story = {args: {status: 'issueClosed', children: 'Closed'}}
export const IssueClosedNotPlanned: Story = {args: {status: 'issueClosedNotPlanned', children: 'Closed'}}
export const IssueDraft: Story = {args: {status: 'issueDraft', children: 'Draft'}}
export const PullOpened: Story = {args: {status: 'pullOpened', children: 'Open'}}
export const PullClosed: Story = {args: {status: 'pullClosed', children: 'Closed'}}
export const PullMerged: Story = {args: {status: 'pullMerged', children: 'Merged'}}
export const Queued: Story = {args: {status: 'pullQueued', children: 'Queued'}}
export const Draft: Story = {args: {status: 'draft', children: 'Draft'}}
export const Unavailable: Story = {args: {status: 'unavailable', children: 'Unavailable'}}
export const AlertOpened: Story = {args: {status: 'alertOpened', children: 'Open'}}
export const AlertFixed: Story = {args: {status: 'alertFixed', children: 'Fixed'}}
export const AlertDismissed: Story = {args: {status: 'alertDismissed', children: 'Dismissed'}}
export const AlertClosed: Story = {args: {status: 'alertClosed', children: 'Closed'}}
export const Archived: Story = {args: {status: 'archived', children: 'Archived'}}
export const Open: Story = {
  args: {status: 'open', children: 'Open'},
  render: () => (
    <StateLabel status="open">
      <VisuallyHidden>Milestone</VisuallyHidden>
      Open
    </StateLabel>
  ),
}
export const Closed: Story = {args: {status: 'closed', children: 'Closed'}}
export const Small: Story = {args: {status: 'issueOpened', size: 'small', children: 'Open'}}
