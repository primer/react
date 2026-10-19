import type {ComponentProps, ReactElement} from 'react'
import {EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon} from '@primer/octicons-react'
import type {Meta, StoryFn} from '@storybook/react-vite'
import {IconButton} from '.'
import type {DistributiveOmit} from '../utils/modern-polymorphic'

const icons = {
  EyeClosedIcon: <EyeClosedIcon />,
  EyeIcon: <EyeIcon />,
  SearchIcon: <SearchIcon />,
  XIcon: <XIcon />,
  HeartIcon: <HeartIcon />,
}

type PlaygroundArgs = DistributiveOmit<ComponentProps<typeof IconButton>, 'icon'> & {
  icon: keyof typeof icons | ReactElement
}

const meta: Meta<ComponentProps<typeof IconButton>> = {
  title: 'Components/IconButton',
}

export default meta

export const Playground: StoryFn<PlaygroundArgs> = ({icon, ...args}) => (
  <IconButton {...args} icon={typeof icon === 'string' ? icons[icon] : icon} />
)
Playground.argTypes = {
  size: {
    control: {
      type: 'radio',
    },
    options: ['small', 'medium', 'large'],
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  inactive: {
    control: {
      type: 'boolean',
    },
  },
  variant: {
    control: {
      type: 'radio',
    },
    options: ['default', 'primary', 'danger', 'invisible'],
  },
  icon: {
    options: Object.keys(icons),
    control: {type: 'select'},
    mapping: icons,
  },
}
Playground.args = {
  size: 'medium',
  disabled: false,
  inactive: false,
  variant: 'default',
  'aria-label': 'Favorite',
  icon: 'HeartIcon',
}

export const Default = () => <IconButton icon={<HeartIcon />} aria-label="Favorite" />
