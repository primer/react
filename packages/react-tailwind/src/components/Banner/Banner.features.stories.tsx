import {CopilotIcon, GitPullRequestIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {Heading} from '../Heading'
import {Dialog} from '../Dialog'
import {Link} from '../Link'
import {Stack} from '../Stack'
import {Banner} from './index'

const description = (
  <>
    GitHub users are{' '}
    <Link inline href="#">
      now required
    </Link>{' '}
    to enable two-factor authentication as an additional security measure.
  </>
)
const meta = {title: 'React Tailwind/Content/Banner/Features', component: Banner} satisfies Meta<typeof Banner>
export default meta
type Story = StoryObj<typeof meta>

export const Critical: Story = {args: {title: 'Critical', description, variant: 'critical'}}
export const Info: Story = {args: {title: 'Info', description, onDismiss: () => {}, variant: 'info'}}
export const Success: Story = {args: {title: 'Success', description, onDismiss: () => {}, variant: 'success'}}
export const Upsell: Story = {args: {title: 'Upsell', description, onDismiss: () => {}, variant: 'upsell'}}
export const Warning: Story = {args: {title: 'Warning', description, onDismiss: () => {}, variant: 'warning'}}
export const CompoundAlert: Story = {
  render: () => (
    <Banner role="alert" variant="critical">
      <Banner.Title as="h3">Unable to save changes</Banner.Title>
      <Banner.Description>Please try again.</Banner.Description>
    </Banner>
  ),
}
export const Dismiss: Story = {
  render: function DismissStory() {
    return <Banner title="Notice" description={description} onDismiss={() => {}} />
  },
}
export const DismissWithActions: Story = {
  args: {
    title: 'Notice',
    description,
    onDismiss: () => {},
    primaryAction: <Banner.PrimaryAction>Button</Banner.PrimaryAction>,
    secondaryAction: <Banner.SecondaryAction>Button</Banner.SecondaryAction>,
  },
}
export const WithHiddenTitle: Story = {args: {title: 'Warning', hideTitle: true, description, variant: 'warning'}}
export const WithHiddenTitleAndActions: Story = {
  args: {
    title: 'Warning',
    hideTitle: true,
    description,
    variant: 'warning',
    primaryAction: <Banner.PrimaryAction>Button</Banner.PrimaryAction>,
    secondaryAction: <Banner.SecondaryAction>Button</Banner.SecondaryAction>,
  },
}
export const DismissibleWithHiddenTitleAndActions: Story = {
  args: {
    title: 'Warning',
    hideTitle: true,
    description,
    onDismiss: () => {},
    variant: 'warning',
    primaryAction: <Banner.PrimaryAction>Button</Banner.PrimaryAction>,
    secondaryAction: <Banner.SecondaryAction>Button</Banner.SecondaryAction>,
  },
}
export const DismissibleWithHiddenTitleAndSecondaryAction: Story = {
  args: {
    title: 'Warning',
    hideTitle: true,
    description,
    onDismiss: () => {},
    variant: 'warning',
    secondaryAction: <Banner.SecondaryAction leadingVisual={<GitPullRequestIcon />}>Button</Banner.SecondaryAction>,
  },
}
export const WithActions: Story = {
  args: {
    title: 'Warning',
    description,
    variant: 'warning',
    primaryAction: <Banner.PrimaryAction>Button</Banner.PrimaryAction>,
    secondaryAction: <Banner.SecondaryAction>Button</Banner.SecondaryAction>,
  },
}
export const WithLinkActions: Story = {
  args: {
    title: 'Update available',
    description: 'Review the details before updating.',
    primaryAction: <Banner.PrimaryActionLink href="#update">Update</Banner.PrimaryActionLink>,
    secondaryAction: <Banner.SecondaryActionLink href="#details">Details</Banner.SecondaryActionLink>,
  },
}
export const WrappingLinkActions: Story = {
  args: {
    title: 'Security',
    actionsLayout: 'stacked',
    onDismiss: () => {},
    primaryAction: (
      <Banner.PrimaryActionLink href="#review" labelWrap lang="de">
        Sicherheitseinstellungen für dieses Repository überprüfen
      </Banner.PrimaryActionLink>
    ),
    secondaryAction: (
      <Banner.SecondaryActionLink href="#details" labelWrap>
        Learn more about private vulnerability reporting
      </Banner.SecondaryActionLink>
    ),
  },
  render: args => (
    <div data-testid="banner-actions-container" style={{width: 320}}>
      <Banner {...args} />
    </div>
  ),
}
export const CustomIcon: Story = {
  args: {
    title: 'Upsell',
    description: 'An example banner with a custom icon',
    leadingVisual: <CopilotIcon />,
    onDismiss: () => {},
    variant: 'upsell',
  },
}
export const FlushInsideDialog: Story = {
  render: () => (
    <Dialog defaultOpen>
      <Dialog.Content height="small">
        <Dialog.Header>
          <Dialog.Title>Add issue fields</Dialog.Title>
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body className="p-0">
          <Banner
            actionsLayout="inline"
            description="Please try again."
            flush
            primaryAction={<Banner.PrimaryAction>Try again</Banner.PrimaryAction>}
            title="Something went wrong loading custom fields."
            variant="critical"
          />
          <div className="p-4">rest of the dialog content goes here</div>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  ),
}
export const ActionsLayoutStacked: Story = {
  render: () => (
    <Stack gap="spacious">
      <Stack gap="spacious" style={{maxWidth: '320px'}}>
        <Heading size="small" as="h3">
          Mobile (320px)
        </Heading>
        <Banner
          aria-label="Stacked actions, mobile"
          title="Actions Layout: Stacked"
          description="Actions are displayed in a vertical stack on both mobile and desktop."
          variant="info"
          actionsLayout="stacked"
          primaryAction={<Banner.PrimaryAction>Primary Action</Banner.PrimaryAction>}
          secondaryAction={<Banner.SecondaryAction>Secondary Action</Banner.SecondaryAction>}
        />
        <Banner
          aria-label="Dismissible stacked actions, mobile"
          title="Actions Layout: Stacked"
          description="Actions are displayed in a vertical stack on both mobile and desktop."
          variant="info"
          actionsLayout="stacked"
          onDismiss={() => {}}
          primaryAction={<Banner.PrimaryAction>Primary Action</Banner.PrimaryAction>}
          secondaryAction={<Banner.SecondaryAction>Secondary Action</Banner.SecondaryAction>}
        />
      </Stack>
      <Stack gap="spacious" style={{maxWidth: '768px'}}>
        <Heading size="small" as="h3">
          Desktop (768px)
        </Heading>
        <Banner
          aria-label="Stacked actions, desktop"
          title="Actions Layout: Stacked"
          description="Actions are displayed in a vertical stack on both mobile and desktop."
          variant="info"
          actionsLayout="stacked"
          primaryAction={<Banner.PrimaryAction>Primary Action</Banner.PrimaryAction>}
          secondaryAction={<Banner.SecondaryAction>Secondary Action</Banner.SecondaryAction>}
        />
        <Banner
          aria-label="Dismissible stacked actions, desktop"
          title="Actions Layout: Stacked"
          description="Actions are displayed in a vertical stack on both mobile and desktop."
          variant="info"
          actionsLayout="stacked"
          onDismiss={() => {}}
          primaryAction={<Banner.PrimaryAction>Primary Action</Banner.PrimaryAction>}
          secondaryAction={<Banner.SecondaryAction>Secondary Action</Banner.SecondaryAction>}
        />
      </Stack>
    </Stack>
  ),
}
export const ActionsLayoutInline: Story = {
  render: () => (
    <Stack gap="spacious">
      <Stack gap="spacious" style={{maxWidth: '320px'}}>
        <Heading size="small" as="h3">
          Mobile (320px)
        </Heading>
        <Banner
          aria-label="Inline actions, mobile"
          title="A short title"
          description="A very short message."
          variant="warning"
          actionsLayout="inline"
          primaryAction={<Banner.PrimaryAction>Primary</Banner.PrimaryAction>}
        />
        <Banner
          aria-label="Dismissible inline actions, mobile"
          title="A short title"
          description="A very short message."
          variant="warning"
          actionsLayout="inline"
          onDismiss={() => {}}
          primaryAction={<Banner.PrimaryAction>Primary</Banner.PrimaryAction>}
        />
      </Stack>
      <Stack gap="spacious" style={{maxWidth: '768px'}}>
        <Heading size="small" as="h3">
          Desktop (768px)
        </Heading>
        <Banner
          aria-label="Inline actions, desktop"
          title="A short title"
          description="A very short message."
          variant="warning"
          actionsLayout="inline"
          primaryAction={<Banner.PrimaryAction>Primary</Banner.PrimaryAction>}
          secondaryAction={<Banner.SecondaryAction>Secondary</Banner.SecondaryAction>}
        />
        <Banner
          aria-label="Dismissible inline actions, desktop"
          title="A short title"
          description="A very short message."
          variant="warning"
          actionsLayout="inline"
          onDismiss={() => {}}
          primaryAction={<Banner.PrimaryAction>Primary</Banner.PrimaryAction>}
          secondaryAction={<Banner.SecondaryAction>Secondary</Banner.SecondaryAction>}
        />
      </Stack>
    </Stack>
  ),
}
