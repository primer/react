import type {Meta, StoryObj} from '@storybook/react-vite'
import {Truncate} from './Truncate'

const meta = {
  title: 'React Tailwind/Display/Truncate/Examples',
  component: Truncate,
  args: {title: 'Example text', children: 'Example text'},
} satisfies Meta<typeof Truncate>

export default meta
type Story = StoryObj<typeof meta>

export const NavigationLabel: Story = {
  render: () => (
    <nav aria-label="Breadcrumb">
      <Truncate inline maxWidth={180} title="github/design-system/packages/react">
        github/design-system/packages/react
      </Truncate>
    </nav>
  ),
}

export const CustomContent: Story = {
  render: () => (
    <Truncate title="A long status message">
      <strong>A long status message</strong>
    </Truncate>
  ),
}

export const NarrowContainer: Story = {
  render: () => (
    <div className="w-32">
      <Truncate title="This text is clipped inside a narrow container">
        This text is clipped inside a narrow container
      </Truncate>
    </div>
  ),
}
