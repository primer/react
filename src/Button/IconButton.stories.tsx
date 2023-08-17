import React, {ComponentProps} from 'react'
import {EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon} from '@primer/octicons-react'
import {Meta, StoryFn} from '@storybook/react'
import {IconButton} from '.'
import {OcticonArgType} from '../utils/story-helpers'

const meta: Meta<ComponentProps<typeof IconButton>> = {
  title: 'Components/IconButton',
  argTypes: {
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
    variant: {
      control: {
        type: 'radio',
      },
      options: ['default', 'primary', 'danger', 'invisible'],
    },
    icon: OcticonArgType([EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon]),
  },
  args: {
    size: 'medium',
    disabled: false,
    variant: 'default',
    'aria-label': 'Icon button description',
    icon: XIcon,
  },
}

export default meta

export const Playground: StoryFn<typeof IconButton> = args => <IconButton {...args} />

export const Default = () => <IconButton icon={HeartIcon} aria-label="Default" />
