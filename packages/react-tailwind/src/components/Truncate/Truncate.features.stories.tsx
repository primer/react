import type {Meta, StoryObj} from '@storybook/react-vite'
import {ArrowLeftIcon, ArrowRightIcon} from '@primer/octicons-react'
import {Truncate} from './Truncate'

const meta = {
  title: 'React Tailwind/Display/Truncate/Features',
  component: Truncate,
  args: {title: 'Example text', children: 'Example text'},
} satisfies Meta<typeof Truncate>

export default meta
type Story = StoryObj<typeof meta>

export const Expandable: Story = {
  args: {title: 'Hover this example text', expandable: true, children: 'Hover this example text'},
}

export const Inline: Story = {
  render: () => (
    <>
      <ArrowRightIcon className="inline" />
      <Truncate title="Inline example text" inline>
        Inline example text
      </Truncate>
      <ArrowLeftIcon className="inline" />
    </>
  ),
}

export const MaxWidth: Story = {
  args: {
    title: 'Some example text with a max width',
    maxWidth: 200,
    children: 'Some example text with a max width',
  },
}

export const Overflow: Story = {
  args: {
    title: 'A deliberately long label that overflows its container',
    maxWidth: '8rem',
    children: 'A deliberately long label that overflows its container',
  },
}

export const CustomElement: Story = {
  args: {as: 'div', title: 'A block-level truncated label', children: 'A block-level truncated label'},
}
