import React from 'react'
import {Button, Box} from '../..'
import {Tooltip} from './Tooltip'
import {Meta, StoryFn} from '@storybook/react'

export default {
  title: 'Drafts/Components/Tooltip/Playground',
  component: Tooltip,

  args: {
    text: 'This is the tooltip text',
    direction: 's',
    type: 'description',
  },
  argTypes: {
    text: {control: {type: 'text'}},
    direction: {
      control: {type: 'radio'},
      options: ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'],
    },
    type: {
      control: false,
    },
  },
} as Meta<typeof Tooltip>

// Description type, north direction by default
export const Playground: StoryFn = args => {
  // this is a hack to remove the `type` prop from the args because for this example type label is not a valid choice and violates accessibility
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {text, type, ...rest} = args
  return (
    <Box sx={{p: 6}}>
      <Tooltip text={text} type="description" {...rest}>
        <Button>Delete</Button>
      </Tooltip>
    </Box>
  )
}
