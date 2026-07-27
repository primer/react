import type {Meta, StoryObj} from '@storybook/react-vite'
import type {ComponentProps} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {Accordion} from '.'

type Args = ComponentProps<typeof Accordion> & {
  defaultExpanded: boolean
  disabled: boolean
}

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  args: {
    children: null,
    defaultExpanded: false,
    disabled: false,
  },
  argTypes: {
    children: {
      control: false,
    },
  },
} satisfies Meta<Args>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Accordion>
      <Accordion.Item>
        <Accordion.Heading>What is Primer?</Accordion.Heading>
        <Accordion.Panel>Primer is GitHub’s design system.</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Heading>Who can use Primer?</Accordion.Heading>
        <Accordion.Panel>Anyone building GitHub experiences can use Primer.</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  ),
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', {name: 'What is Primer?'})

    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByText('Primer is GitHub’s design system.')).toBeVisible()
  },
}

export const Playground: StoryObj<Args> = {
  render: ({defaultExpanded, disabled}) => (
    <Accordion>
      <Accordion.Item defaultExpanded={defaultExpanded} disabled={disabled}>
        <Accordion.Heading>What is Primer?</Accordion.Heading>
        <Accordion.Panel>Primer is GitHub’s design system.</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  ),
}
