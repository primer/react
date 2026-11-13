import {LinkExternalIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {IconLinkButton} from './IconLinkButton'

const meta = {
  title: 'React Tailwind/Components/IconLinkButton',
  component: IconLinkButton,
  args: {'aria-label': 'View documentation', href: '#documentation', icon: <LinkExternalIcon />},
  argTypes: {
    icon: {control: false},
    render: {control: false},
    size: {control: 'radio', options: ['small', 'medium', 'large']},
    tooltipDirection: {control: 'radio', options: ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']},
    variant: {control: 'radio', options: ['default', 'primary', 'danger', 'invisible', 'link']},
  },
} satisfies Meta<typeof IconLinkButton>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Playground: Story = {
  args: {description: '', keybindingHint: '', size: 'medium', variant: 'default'},
}
