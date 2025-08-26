import type {Meta, StoryFn} from '@storybook/react-vite'
import CircleOcticon from './CircleOcticon'
import type {CircleOcticonProps} from './CircleOcticon'
import {CheckIcon} from '@primer/octicons-react'
// eslint-disable-next-line import/no-namespace
import * as Icons from '@primer/octicons-react'
import classes from './CircleOcticon.stories.module.css'

const meta: Meta<typeof CircleOcticon> = {
  title: 'Deprecated/Components/CircleOcticon',
  component: CircleOcticon,
}
export default meta

export const Default = () => (
  <CircleOcticon icon={CheckIcon} size={32} className={classes.CircleOcticon} aria-label="Changes approved" />
)

type PlaygroundTypes = Omit<CircleOcticonProps, 'icon'> & {icon: keyof typeof Icons}
export const Playground: StoryFn<PlaygroundTypes> = ({
  icon: iconName,
  'aria-label': ariaLabel = 'Changes approved',
  ...args
}) => (
  <CircleOcticon
    icon={Icons[iconName]}
    aria-label={ariaLabel ? ariaLabel : undefined}
    className={classes.CircleOcticon}
    {...args}
  />
)

Playground.args = {
  size: 32,
  icon: 'CheckIcon',
  'aria-label': undefined,
}

Playground.argTypes = {
  size: {
    controls: {
      type: 'number',
    },
  },
  icon: {
    control: {
      type: 'select',
    },
    options: Object.keys(Icons),
  },
  'aria-label': {
    type: 'string',
  },
}
