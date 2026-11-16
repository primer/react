import {EyeClosedIcon, EyeIcon, HeartIcon, SearchIcon, XIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {IconButton} from './IconButton'

const icons = {
  EyeClosedIcon: <EyeClosedIcon />,
  EyeIcon: <EyeIcon />,
  SearchIcon: <SearchIcon />,
  XIcon: <XIcon />,
  HeartIcon: <HeartIcon />,
}

const meta = {
  title: 'React Tailwind/Components/IconButton',
  component: IconButton,
  args: {
    'aria-label': 'Favorite',
    icon: <HeartIcon />,
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Playground: Story = {
  args: {
    description: '',
    disabled: false,
    inactive: false,
    keybindingHint: '',
    size: 'medium',
    variant: 'default',
  },
  argTypes: {
    icon: {control: {type: 'select'}, mapping: icons, options: Object.keys(icons)},
    notificationIndicator: {control: {type: 'radio'}, options: [undefined, 'button', 'icon']},
    tooltipDirection: {control: {type: 'radio'}, options: ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']},
    size: {control: {type: 'radio'}, options: ['small', 'medium', 'large']},
    variant: {control: {type: 'radio'}, options: ['default', 'primary', 'danger', 'invisible']},
  },
}
