import type {Meta, StoryObj} from '@storybook/react-vite'
import {Card as CardRoot, CardAction, CardDescription, CardHeading, CardIcon, CardImage, CardMetadata} from './Card'

const Card = Object.assign(CardRoot, {
  Action: CardAction,
  Description: CardDescription,
  Heading: CardHeading,
  Icon: CardIcon,
  Image: CardImage,
  Metadata: CardMetadata,
})

const meta = {
  title: 'React Tailwind/Content/Card/Examples',
  component: Card,
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<Record<string, never>>

const RepoIcon = () => <span aria-hidden="true">◈</span>

export const RepositorySummary: Story = {
  render: () => (
    <Card as="section">
      <Card.Icon icon={RepoIcon} aria-label="Repository" />
      <Card.Heading>primer/react</Card.Heading>
      <Card.Description>Build consistent user interfaces with GitHub&apos;s design system.</Card.Description>
      <Card.Metadata>TypeScript · 18k stars · Updated today</Card.Metadata>
    </Card>
  ),
}

export const SettingsCard: Story = {
  render: () => (
    <Card padding="condensed">
      <Card.Heading>Notifications</Card.Heading>
      <Card.Description>Choose how you receive notifications about this repository.</Card.Description>
      <div className="flex gap-2">
        <button type="button">Watch</button>
        <button type="button">Save</button>
      </div>
    </Card>
  ),
}

export const EmptyCard: Story = {
  render: () => (
    <Card padding="none">
      <p className="p-6 text-muted">No content available.</p>
    </Card>
  ),
}
