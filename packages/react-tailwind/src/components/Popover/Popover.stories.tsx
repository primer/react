import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, waitFor, within} from 'storybook/test'
import {Button} from '../Button'
import {Popover, type PopoverContentProps, type PopoverRootProps} from './Popover'

interface PopoverStoryArgs
  extends Pick<PopoverRootProps, 'modal'>,
    Pick<PopoverContentProps, 'align' | 'side' | 'sideOffset'> {}

const meta = {
  title: 'React Tailwind/Components/Popover',
  args: {
    align: 'center',
    modal: true,
    side: 'bottom',
    sideOffset: 8,
  },
  argTypes: {
    align: {control: 'select', options: ['start', 'center', 'end']},
    modal: {control: 'select', options: [false, true, 'trap-focus']},
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right', 'inline-start', 'inline-end'],
    },
    sideOffset: {control: {type: 'number', min: 0}},
  },
} satisfies Meta<PopoverStoryArgs>

export default meta

type Story = StoryObj<PopoverStoryArgs>

function PopoverFixture({align = 'center', modal = true, side = 'bottom', sideOffset = 8}: PopoverStoryArgs) {
  return (
    <div className="w-full">
      <Popover open modal={modal}>
        <Popover.Trigger
          nativeButton={false}
          render={<span aria-hidden="true" className="absolute top-0 left-1/2 h-0 w-0" />}
        />
        <Popover.Content
          align={align}
          initialFocus={false}
          portal={false}
          positionerClassName="!relative !inset-auto !transform-none mx-auto mt-2 w-[var(--overlay-width-small)]"
          side={side}
          sideOffset={sideOffset}
        >
          <Popover.Arrow />
          <Popover.Title>Popover heading</Popover.Title>
          <Popover.Description className="my-4 text-md leading-6 text-default">
            Message about popovers
          </Popover.Description>
          <Button>Got it!</Button>
        </Popover.Content>
      </Popover>
    </div>
  )
}

export const Default: Story = {
  render: () => <PopoverFixture />,
}
export const Playground: Story = {
  render: args => <PopoverFixture {...args} />,
}
export const WithArrow: Story = {
  render: () => (
    <Popover>
      <Popover.Button>More</Popover.Button>
      <Popover.Content>
        <Popover.Arrow />
        Positioned content
      </Popover.Content>
    </Popover>
  ),
  play: async ({canvasElement}) => {
    await userEvent.click(within(canvasElement).getByRole('button', {name: 'More'}))
    const content = await within(document.body).findByText('Positioned content')
    await waitFor(() => expect(content).toBeVisible())
  },
}
