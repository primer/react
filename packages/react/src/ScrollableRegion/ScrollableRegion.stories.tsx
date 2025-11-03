import type {Meta, StoryObj} from '@storybook/react-vite'
import {ScrollableRegion} from '../ScrollableRegion'

const meta = {
  title: 'Experimental/Components/ScrollableRegion',
  component: ScrollableRegion,
} satisfies Meta<typeof ScrollableRegion>

export default meta

export const Default = () => {
  return (
    <ScrollableRegion aria-label="Example scrollable region">
      <p>Example content that triggers overflow.</p>
      <p
        style={{
          whiteSpace: 'nowrap',
        }}
      >
        The content here will not wrap at smaller screen sizes and will trigger the component to set the container as a
        region, label it, make it focusable, and make it scrollable.
      </p>
    </ScrollableRegion>
  )
}

export const Playground: StoryObj<typeof ScrollableRegion> = {
  render: args => {
    return (
      <ScrollableRegion {...args}>
        <p>Example content that triggers overflow.</p>
        <p
          style={{
            whiteSpace: 'nowrap',
          }}
        >
          The content here will not wrap at smaller screen sizes and will trigger the component to set the container as
          a region, label it, make it focusable, and make it scrollable.
        </p>
      </ScrollableRegion>
    )
  },
  args: {
    'aria-label': 'Example scrollable region',
  },
  argTypes: {
    'aria-label': {
      control: 'text',
    },
    'aria-labelledby': {
      control: 'text',
    },
    className: {
      control: 'text',
    },
  },
}
