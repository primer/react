import type {Meta, StoryObj} from '@storybook/react-vite'
import {Breadcrumbs} from './Breadcrumbs'

const meta = {
  title: 'React Tailwind/Navigation/Breadcrumbs/Examples',
  component: Breadcrumbs,
} satisfies Meta<typeof Breadcrumbs>
export default meta
type Story = StoryObj<typeof meta>

export const ProjectLocation: Story = {
  render: () => (
    <Breadcrumbs overflow="menu">
      <Breadcrumbs.Item href="#">Projects</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Design system</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Components</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Navigation</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#" selected>
        Breadcrumbs
      </Breadcrumbs.Item>
    </Breadcrumbs>
  ),
}
