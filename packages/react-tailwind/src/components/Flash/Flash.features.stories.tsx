import type {Meta, StoryObj} from '@storybook/react-vite'
import {AlertIcon, CheckCircleIcon, InfoIcon, XIcon} from '@primer/octicons-react'
import {Button} from '../Button'
import {IconButton} from '../IconButton'
import {Link} from '../Link'
import {Flash} from './Flash'

const meta = {
  title: 'React Tailwind/Content/Flash/Features',
  component: Flash,
} satisfies Meta<typeof Flash>

export default meta
type Story = StoryObj<typeof meta>

const Message = ({
  full,
  label,
  icon: Icon,
  variant,
}: {
  full?: boolean
  label: string
  icon: React.ElementType
  variant: React.ComponentProps<typeof Flash>['variant']
}) => (
  <Flash
    full={full}
    variant={variant}
    className="grid grid-cols-[min-content_1fr_minmax(0,auto)] [grid-template-areas:'visual_message_actions']"
  >
    <div className="grid self-start py-2 [grid-area:visual]">
      <Icon aria-label={label} />
    </div>
    <div className="self-center px-2 py-1.5 text-sm leading-[var(--text-body-lineHeight-large)] [grid-area:message]">
      {label}
    </div>
  </Flash>
)

export const Success: Story = {render: () => <Message label="Success" icon={CheckCircleIcon} variant="success" />}
export const Danger: Story = {render: () => <Message label="Danger" icon={InfoIcon} variant="danger" />}
export const Warning: Story = {render: () => <Message label="Warning" icon={AlertIcon} variant="warning" />}
export const Full: Story = {
  render: () => <Message full label="Full" icon={InfoIcon} variant="default" />,
}

export const WithIconAndAction: Story = {
  render: () => (
    <Flash className="grid grid-cols-[min-content_1fr_minmax(0,auto)] [grid-template-areas:'visual_message_actions'] max-[543.98px]:grid-cols-[min-content_1fr] max-[543.98px]:grid-rows-[min-content_min-content] max-[543.98px]:[grid-template-areas:'visual_message''._actions']">
      <div className="grid self-start py-2 [grid-area:visual]">
        <InfoIcon aria-label="Info" />
      </div>
      <div className="self-center px-2 py-1.5 text-sm leading-[var(--text-body-lineHeight-large)] [grid-area:message]">
        This is a flash message with an icon and an action.
        <Link href="/"> Learn more.</Link>
      </div>
      <div className="max-[543.98px]:mt-2 max-[543.98px]:ml-2 max-[543.98px]:self-start [grid-area:actions]">
        <Button>Join waitlist</Button>
      </div>
    </Flash>
  ),
}

export const WithIconActionDismiss: Story = {
  render: () => (
    <Flash className="grid grid-cols-[min-content_1fr_minmax(0,auto)] [grid-template-areas:'visual_message_actions_close'] max-[543.98px]:grid-cols-[min-content_1fr] max-[543.98px]:grid-rows-[min-content_min-content] max-[543.98px]:[grid-template-areas:'visual_message_close''._actions_actions']">
      <div className="grid self-start py-2 [grid-area:visual]">
        <InfoIcon aria-label="Info" />
      </div>
      <div className="self-center px-2 py-1.5 text-sm leading-[var(--text-body-lineHeight-large)] [grid-area:message]">
        This is a flash message with an icon and an action.
        <Link href="/"> Learn more.</Link>
      </div>
      <div className="max-[543.98px]:mt-2 max-[543.98px]:ml-2 max-[543.98px]:self-start [grid-area:actions]">
        <Button>Join waitlist</Button>
      </div>
      <div className="ml-2 [grid-area:close] [&_svg]:mr-0 [&_svg]:text-muted">
        <IconButton aria-label="Dismiss" icon={XIcon} variant="invisible" />
      </div>
    </Flash>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-2">
      <Flash variant="default">Default message</Flash>
      <Flash variant="success">Success message</Flash>
      <Flash variant="warning">Warning message</Flash>
      <Flash variant="danger">Danger message</Flash>
    </div>
  ),
}
