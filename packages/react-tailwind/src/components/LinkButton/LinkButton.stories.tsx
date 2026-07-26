import type {Meta, StoryObj} from '@storybook/react-vite'
import {LinkButton} from './LinkButton'

const meta = {
  title: 'React Tailwind/Components/LinkButton',
  component: LinkButton,
  args: {
    alignContent: 'center',
    block: false,
    children: 'Default',
    disabled: false,
    href: '#',
    inactive: false,
    labelWrap: false,
    loading: false,
    size: 'medium',
    variant: 'default',
  },
  argTypes: {
    alignContent: {control: 'radio', options: ['center', 'start']},
    block: {control: 'boolean'},
    count: {control: 'text'},
    disabled: {control: 'boolean'},
    href: {control: 'text'},
    inactive: {control: 'boolean'},
    labelWrap: {control: 'boolean'},
    leadingVisual: {control: false},
    loading: {control: 'boolean'},
    loadingAnnouncement: {control: 'text'},
    render: {control: false},
    size: {control: 'radio', options: ['small', 'medium', 'large']},
    trailingAction: {control: false},
    trailingVisual: {control: false},
    variant: {control: 'radio', options: ['default', 'primary', 'danger', 'invisible', 'link']},
  },
} satisfies Meta<typeof LinkButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Playground: Story = {}
