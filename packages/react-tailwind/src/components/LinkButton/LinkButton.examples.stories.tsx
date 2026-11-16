import type {Meta, StoryObj} from '@storybook/react-vite'
import {LinkButton} from './LinkButton'

const meta = {
  title: 'React Tailwind/Components/LinkButton/Examples',
  component: LinkButton,
  args: {children: 'View settings', href: '#settings'},
} satisfies Meta<typeof LinkButton>

export default meta
type Story = StoryObj<typeof meta>

export const SettingsNavigation: Story = {
  render: () => (
    <nav className="flex gap-2" aria-label="Settings">
      <LinkButton href="#profile" variant="default">
        Profile
      </LinkButton>
      <LinkButton href="#security" variant="invisible">
        Security
      </LinkButton>
    </nav>
  ),
}
