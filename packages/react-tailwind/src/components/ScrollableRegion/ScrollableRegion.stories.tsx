import type {Meta, StoryObj} from '@storybook/react-vite'
import {ScrollableRegion} from './ScrollableRegion'

const meta = {
  title: 'React Tailwind/Components/ScrollableRegion',
  component: ScrollableRegion,
  argTypes: {
    'aria-label': {control: 'text'},
    'aria-labelledby': {control: 'text'},
    className: {control: 'text'},
    children: {control: false},
  },
} satisfies Meta<typeof ScrollableRegion>

export default meta

type Story = StoryObj<typeof meta>

const content = (
  <>
    <p>Example content that triggers overflow.</p>
    <p className="whitespace-nowrap">
      The content here will not wrap at smaller screen sizes and will trigger the component to set the container as a
      region, label it, make it focusable, and make it scrollable.
    </p>
  </>
)

export const Default: Story = {
  args: {
    'aria-label': 'Example scrollable region',
    children: content,
  },
}

export const Playground: Story = {
  args: {
    'aria-label': 'Example scrollable region',
    children: content,
  },
}
