import type {Meta, StoryObj} from '@storybook/react-vite'
import {Button} from '../../Button'
import {Tooltip} from './TriggerComposition'

const meta = {
  title: 'Experimental/Components/Tooltip',
  component: Tooltip,
  args: {
    text: 'Additional context',
    renderAnchor: <Button>Action</Button>,
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Playground: Story = {}
