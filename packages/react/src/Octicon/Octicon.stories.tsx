import type {Meta, StoryFn} from '@storybook/react-vite'
import Octicon from './Octicon'
import {HeartFillIcon} from '@primer/octicons-react'

const meta: Meta<typeof Octicon> = {
  title: 'Deprecated/Components/Octicon',
  component: Octicon,
}
export default meta

export const Default = () => <Octicon icon={HeartFillIcon} aria-label="Like" size={32} />

export const Playground: StoryFn<typeof Octicon> = ({'aria-label': ariaLabel, icon: _icon, ...args}) => {
  return <Octicon {...args} icon={HeartFillIcon} aria-label={ariaLabel ? ariaLabel : undefined} />
}

Playground.args = {
  'aria-label': 'Heart',
  size: 32,
}

Playground.argTypes = {
  size: {
    control: {
      type: 'number',
    },
  },
  verticalAlign: {
    type: 'string',
    control: {type: 'select'},
    options: ['middle', 'text-bottom', 'text-top', 'top', 'unset'],
  },
  icon: {
    controls: false,
    table: {
      disable: true,
    },
  },
  as: {
    controls: false,
    table: {
      disable: true,
    },
  },
}
