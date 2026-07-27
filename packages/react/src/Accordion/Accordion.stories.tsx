import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {
  AccordionHeading,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  type AccordionRootProps,
  AccordionTrigger,
} from './Accordion'

type AccordionStoryArgs = Omit<AccordionRootProps, 'children'> & {
  defaultExpanded?: boolean
}

const meta = {
  title: 'Components/Accordion',
  component: AccordionRoot,
} satisfies Meta<AccordionStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <AccordionRoot>
      <AccordionItem defaultExpanded>
        <AccordionHeading>
          <AccordionTrigger>Account settings</AccordionTrigger>
        </AccordionHeading>
        <AccordionPanel>Manage your profile, email addresses, and notification preferences.</AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeading>
          <AccordionTrigger>Repository access</AccordionTrigger>
        </AccordionHeading>
        <AccordionPanel>Review repositories and organizations that can access your account.</AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeading>
          <AccordionTrigger>Billing and plans</AccordionTrigger>
        </AccordionHeading>
        <AccordionPanel>View invoices, payment methods, and plan usage.</AccordionPanel>
      </AccordionItem>
    </AccordionRoot>
  ),
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    const repositoryAccess = canvas.getByRole('button', {name: 'Repository access'})
    const billing = canvas.getByRole('button', {name: 'Billing and plans'})

    await expect(repositoryAccess).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(repositoryAccess)
    await expect(repositoryAccess).toHaveAttribute('aria-expanded', 'true')

    billing.focus()
    await userEvent.keyboard('{Enter}')
    await expect(billing).toHaveAttribute('aria-expanded', 'true')
  },
}

export const Playground: Story = {
  args: {
    defaultExpanded: false,
  },
  argTypes: {
    defaultExpanded: {
      control: 'boolean',
    },
  },
  render: ({defaultExpanded, ...rootProps}) => (
    <AccordionRoot {...rootProps}>
      <AccordionItem defaultExpanded={defaultExpanded}>
        <AccordionHeading>
          <AccordionTrigger>Deployment protection rules</AccordionTrigger>
        </AccordionHeading>
        <AccordionPanel>Configure required reviewers and wait timers before a deployment can proceed.</AccordionPanel>
      </AccordionItem>
    </AccordionRoot>
  ),
}
