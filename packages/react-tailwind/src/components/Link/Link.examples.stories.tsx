import type {Meta, StoryObj} from '@storybook/react-vite'
import {Link} from './Link'

const meta = {
  title: 'React Tailwind/Display/Link/Examples',
  component: Link,
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const InlineDocumentation: Story = {
  render: () => (
    <p>
      Read the{' '}
      <Link href="#documentation" inline>
        documentation
      </Link>{' '}
      before continuing.
    </p>
  ),
}
