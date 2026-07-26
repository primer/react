import type {Meta, StoryObj} from '@storybook/react-vite'
import {Stack, StackItem} from './Stack'

const meta = {
  title: 'React Tailwind/Layout/Stack',
  component: Stack,
  render: args => (
    <Stack {...args}>
      <StackItem className="rounded-md bg-[var(--display-lemon-bgColor-muted)] p-2">First</StackItem>
      <StackItem className="rounded-md bg-[var(--display-olive-bgColor-muted)] p-2">Second</StackItem>
      <StackItem className="rounded-md bg-[var(--display-lime-bgColor-muted)] p-2">Third</StackItem>
    </Stack>
  ),
  argTypes: {
    as: {control: 'select', options: ['div', 'section', 'nav']},
    gap: {
      control: 'select',
      options: ['none', 'tight', 'condensed', 'cozy', 'normal', 'spacious'],
    },
    direction: {control: 'select', options: ['horizontal', 'vertical']},
    align: {
      control: 'select',
      options: ['stretch', 'start', 'center', 'end', 'baseline'],
    },
    wrap: {control: 'radio', options: ['wrap', 'nowrap']},
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'space-between', 'space-evenly'],
    },
    padding: {
      control: 'select',
      options: ['none', 'tight', 'condensed', 'cozy', 'normal', 'spacious'],
    },
    paddingBlock: {
      control: 'select',
      options: ['none', 'tight', 'condensed', 'cozy', 'normal', 'spacious'],
    },
    paddingInline: {
      control: 'select',
      options: ['none', 'tight', 'condensed', 'cozy', 'normal', 'spacious'],
    },
  },
} satisfies Meta<typeof Stack>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {args: {gap: 'normal'}}
export const Playground: Story = {
  args: {
    gap: 'normal',
    as: 'div',
    direction: 'vertical',
    align: 'stretch',
    wrap: 'nowrap',
    justify: 'start',
    padding: 'none',
    paddingBlock: 'none',
    paddingInline: 'none',
  },
}
export const Responsive: Story = {
  render: () => (
    <Stack direction={{narrow: 'vertical', regular: 'horizontal'}} gap="normal">
      <StackItem className="rounded-md bg-muted p-2">One</StackItem>
      <StackItem className="rounded-md bg-muted p-2">Two</StackItem>
    </Stack>
  ),
}
