import type {Meta, StoryObj} from '@storybook/react-vite'
import {Heading} from './Heading'

const meta = {
  title: 'React Tailwind/Display/Heading/Examples',
  component: Heading,
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

export const PageOutline: Story = {
  render: () => (
    <section>
      <Heading as="h1" size="display">
        Repository settings
      </Heading>
      <Heading as="h2" size="large">
        General
      </Heading>
    </section>
  ),
}
