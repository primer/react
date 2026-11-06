import type {Meta, StoryObj} from '@storybook/react-vite'
import {Text} from '../Text'
import {Hidden} from './Hidden'

const meta = {
  title: 'React Tailwind/Components/Hidden',
  component: Hidden,
  parameters: {controls: {expanded: true}},
  args: {children: 'Hidden content', when: ['narrow']},
  argTypes: {
    when: {
      control: 'multi-select',
      options: ['narrow', 'regular', 'wide'],
      description: 'The Primer viewport range or ranges where content is hidden.',
    },
  },
} satisfies Meta<typeof Hidden>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <>
      <Text className="leading-6">
        The below content is visible when the viewport is regular or wide but hidden when narrow:
      </Text>
      <Hidden when="narrow">
        This is the said content and it is visible when the viewport is regular or wide but hidden when narrow
      </Hidden>
    </>
  ),
}

export const Playground: Story = {
  render: args => <Hidden {...args}>The content is hidden when the viewport is {Array(args.when).join(',')}</Hidden>,
}
