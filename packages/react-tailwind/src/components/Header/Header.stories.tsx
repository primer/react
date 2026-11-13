import type {Meta, StoryObj} from '@storybook/react-vite'
import {MarkGithubIcon} from '@primer/octicons-react'
import {Avatar} from '../Avatar'
import {Header} from './Header'

const meta = {
  title: 'React Tailwind/Layout/Header',
  component: Header,
  render: args => (
    <Header {...args}>
      <Header.Item>
        <Header.Link className="text-body-large" href="#">
          <MarkGithubIcon className="mr-2" size={32} />
          <span>GitHub</span>
        </Header.Link>
      </Header.Item>
      <Header.Item full>Menu</Header.Item>
      <Header.Item className="mr-0">
        <Avatar src="https://github.com/octocat.png" size={20} square alt="@octocat" />
      </Header.Item>
    </Header>
  ),
  argTypes: {
    as: {control: 'select', options: ['header', 'div', 'nav']},
  },
} satisfies Meta<typeof Header>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {args: {as: 'div'}}
export const Items: Story = {}
