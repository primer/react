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

interface StackItemPlaygroundArgs {
  grow: boolean
  growNarrow: boolean
  growRegular: boolean
  growWide: boolean
  shrink: boolean
  shrinkNarrow: boolean
  shrinkRegular: boolean
  shrinkWide: boolean
}

function responsiveControlValue(value: boolean, viewports: {narrow: boolean; regular: boolean; wide: boolean}) {
  return Object.values(viewports).every(viewportValue => viewportValue === value) ? value : viewports
}

function booleanControl(category: string) {
  return {control: {type: 'boolean' as const}, table: {category}}
}

export const StackItemPlayground: StoryObj<StackItemPlaygroundArgs> = {
  args: {
    grow: true,
    growNarrow: true,
    growRegular: true,
    growWide: true,
    shrink: true,
    shrinkNarrow: true,
    shrinkRegular: true,
    shrinkWide: true,
  },
  argTypes: {
    grow: booleanControl('Properties'),
    growNarrow: booleanControl('Narrow properties'),
    growRegular: booleanControl('Regular properties'),
    growWide: booleanControl('Wide properties'),
    shrink: booleanControl('Properties'),
    shrinkNarrow: booleanControl('Narrow properties'),
    shrinkRegular: booleanControl('Regular properties'),
    shrinkWide: booleanControl('Wide properties'),
  },
  render: args => (
    <Stack gap="normal" direction="horizontal" align="center" justify="space-between" wrap="nowrap">
      <StackItem
        grow={responsiveControlValue(args.grow, {
          narrow: args.growNarrow,
          regular: args.growRegular,
          wide: args.growWide,
        })}
        shrink={responsiveControlValue(args.shrink, {
          narrow: args.shrinkNarrow,
          regular: args.shrinkRegular,
          wide: args.shrinkWide,
        })}
      >
        <div className="rounded-md bg-[var(--display-indigo-bgColor-muted)] p-2">Adjust this item</div>
      </StackItem>
      <StackItem>
        <div className="rounded-md bg-[var(--display-purple-bgColor-muted)] p-2">Fixed width</div>
      </StackItem>
      <StackItem>
        <div className="rounded-md bg-[var(--display-purple-bgColor-muted)] p-2">Fixed width</div>
      </StackItem>
    </Stack>
  ),
}
