import type {Meta, StoryFn} from '@storybook/react-vite'
import CircleOcticon from './CircleOcticon'
import type {CircleOcticonProps} from './CircleOcticon'
import {CheckIcon} from '@primer/octicons-react'
// eslint-disable-next-line import/no-namespace
import * as Icons from '@primer/octicons-react'

const meta: Meta<typeof CircleOcticon> = {
  title: 'Deprecated/Components/CircleOcticon',
  component: CircleOcticon,
}
export default meta

export const Default = () => (
  <CircleOcticon
    icon={CheckIcon}
    size={32}
    sx={{backgroundColor: 'success.emphasis', color: 'fg.onEmphasis'}}
    aria-label="Changes approved"
  />
)

type PlaygroundTypes = Omit<CircleOcticonProps, 'icon'> & {icon: keyof typeof Icons}
export const Playground: StoryFn<PlaygroundTypes> = ({
  icon: iconName,
  'aria-label': ariaLabel = 'Changes approved',
  ...args
}) => <CircleOcticon icon={Icons[iconName]} aria-label={ariaLabel ? ariaLabel : undefined} {...args} />

Playground.args = {
  size: 32,
  icon: 'CheckIcon',
  'aria-label': undefined,
  sx: {backgroundColor: 'success.emphasis', color: 'fg.onEmphasis'},
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
  sx: {
    controls: false,
  },
}
