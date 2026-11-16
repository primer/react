import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageLayout} from '../PageLayout'
import {NavList} from './NavList'
const meta = {
  title: 'React Tailwind/Navigation/NavList',
  component: NavList,
  parameters: {
    layout: 'fullscreen',
  },
  args: {'aria-label': 'Repository settings'},
  argTypes: {
    'aria-label': {control: 'text'},
  },
} satisfies Meta<typeof NavList>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <PageLayout>
      <PageLayout.Pane position="start">
        <NavList>
          <NavList.List>
            <NavList.Item href="#" aria-current="page">
              Item 1
            </NavList.Item>
            <NavList.Item href="#">Item 2</NavList.Item>
            <NavList.Item href="#">Item 3</NavList.Item>
          </NavList.List>
        </NavList>
      </PageLayout.Pane>
      <PageLayout.Content />
    </PageLayout>
  ),
}

export const Playground: Story = {
  render: args => (
    <PageLayout>
      <PageLayout.Pane position="start">
        <NavList {...args}>
          <NavList.List>
            <NavList.Item href="#" aria-current="page">
              Item 1
            </NavList.Item>
            <NavList.Item href="#">Item 2</NavList.Item>
            <NavList.Item href="#">Item 3</NavList.Item>
          </NavList.List>
        </NavList>
      </PageLayout.Pane>
      <PageLayout.Content />
    </PageLayout>
  ),
}
