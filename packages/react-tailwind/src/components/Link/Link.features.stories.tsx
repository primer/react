import type {Meta, StoryObj} from '@storybook/react-vite'
import {Link} from './Link'

const meta = {title: 'React Tailwind/Display/Link/Features', component: Link} satisfies Meta<typeof Link>
export default meta
type Story = StoryObj<typeof meta>
export const Muted: Story = {args: {href: '#', muted: true, children: 'Link'}}
export const Inline: Story = {
  render: () => (
    <div data-a11y-link-underlines="true">
      <Link inline href="#">
        Link
      </Link>
    </div>
  ),
}
