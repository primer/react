import {EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon, ChevronRightIcon} from '@primer/octicons-react'
import type {Meta, StoryFn} from '@storybook/react-vite'
import {LinkButton} from '.'
import {OcticonArgType} from '../utils/story-helpers'

export default {
  title: 'Components/LinkButton',
} as Meta<typeof LinkButton>

export const Playground: StoryFn = args => <LinkButton {...args}>Default</LinkButton>
Playground.argTypes = {
  size: {
    control: {
      type: 'radio',
    },
    options: ['small', 'medium', 'large'],
  },
  variant: {
    control: {
      type: 'radio',
    },
    options: ['default', 'primary', 'danger', 'invisible', 'outline', 'link'],
  },
  alignContent: {
    control: {
      type: 'radio',
    },
    options: ['center', 'start'],
  },
  block: {
    control: {
      type: 'boolean',
    },
  },
  leadingVisual: OcticonArgType([EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon]),
  trailingVisual: OcticonArgType([EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon]),
  trailingAction: OcticonArgType([ChevronRightIcon]),
  href: {control: 'text'},
  loading: {
    control: {
      type: 'boolean',
    },
  },
}
Playground.args = {
  block: false,
  size: 'medium',
  variant: 'default',
  alignContent: 'center',
  trailingVisual: null,
  leadingVisual: null,
  href: '#',
  loading: false,
}

export const Default = () => <LinkButton href="#">Default</LinkButton>
