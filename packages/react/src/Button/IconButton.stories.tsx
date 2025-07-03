import type {ComponentProps} from 'react'
import {EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon} from '@primer/octicons-react'
import type {Meta, StoryFn} from '@storybook/react-vite'
import {IconButton} from '.'
import {OcticonArgType} from '../utils/story-helpers'

const meta: Meta<ComponentProps<typeof IconButton>> = {
  title: 'Components/IconButton',
}

export default meta

export const Playground: StoryFn<typeof IconButton> = args => <IconButton {...args} />
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
  icon: OcticonArgType([EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon]),
}
Playground.args = {
  size: 'medium',
  disabled: false,
  inactive: false,
  variant: 'default',
  'aria-label': 'Favorite',
  icon: HeartIcon,
}

export const Default = () => <IconButton icon={HeartIcon} aria-label="Favorite" />
