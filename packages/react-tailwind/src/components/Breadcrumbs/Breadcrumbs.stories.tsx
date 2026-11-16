import type {Meta, StoryObj} from '@storybook/react-vite'
import {Breadcrumbs} from './Breadcrumbs'

const meta = {
  title: 'React Tailwind/Navigation/Breadcrumbs',
  component: Breadcrumbs,
  args: {overflow: 'wrap', variant: 'normal'},
  argTypes: {
    overflow: {
      control: 'select',
      options: ['wrap', 'menu', 'menu-with-root'],
    },
    variant: {control: 'radio', options: ['normal', 'spacious']},
  },
  render: args => (
    <Breadcrumbs {...args}>
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">About</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#" selected>
        Team
      </Breadcrumbs.Item>
    </Breadcrumbs>
  ),
} satisfies Meta<typeof Breadcrumbs>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {}
export const OverflowMenu: Story = {args: {overflow: 'menu'}}
