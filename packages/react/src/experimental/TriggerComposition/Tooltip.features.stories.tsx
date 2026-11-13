import {useState} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {Button} from '../../Button'
import {Tooltip} from './TriggerComposition'

const meta = {
  title: 'Experimental/Components/Tooltip/Features',
  component: Tooltip,
  args: {
    text: 'Additional context',
    renderAnchor: <Button>Action</Button>,
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const ControlledVisibility: Story = {
  render: function ControlledVisibility(args) {
    const [open, setOpen] = useState(false)
    const [lastRequest, setLastRequest] = useState('None')
    return (
      <>
        <Button onClick={() => setOpen(true)}>Show tooltip</Button>{' '}
        <Button onClick={() => setOpen(false)}>Hide tooltip</Button>{' '}
        <Tooltip
          {...args}
          open={open}
          onOpenChange={(next, {reason}) => {
            setLastRequest(`${next ? 'Open' : 'Close'}: ${reason}`)
            setOpen(next)
          }}
        />
        <p>Last interaction request: {lastRequest}</p>
      </>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Show tooltip and Hide tooltip change visibility without focusing the trigger. Hover, keyboard focus, blur, and Escape request changes through onOpenChange; open remains authoritative. Updating open itself does not emit another request.',
      },
    },
  },
}

export const SeparatePopupAttributes: Story = {
  args: {
    id: 'action-trigger',
    className: 'action-trigger',
    popupProps: {
      id: 'action-tooltip',
      className: 'action-tooltip',
      style: {fontWeight: 'var(--base-text-weight-semibold)'},
    },
    text: 'The trigger and popup each receive their own HTML attributes.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Incoming HTML props configure the trigger. popupProps configures the bubble independently, including its className, id, style, and handlers. The ref still points to the trigger.',
      },
    },
  },
}
