import React, {useState} from 'react'
import type {Args, Meta} from '@storybook/react'

import {Box} from '..'
import {AnchoredOverlay} from '../AnchoredOverlay'
import {Button} from '../Button'
import {action} from '@storybook/addon-actions'

export default {
  title: 'Components/AnchoredOverlay',
  component: AnchoredOverlay,
} as Meta

export const Default = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Button</Button>}
    >
      <Box width="100%" height="100%" backgroundColor="thistle" display="flex" flexDirection="column">
        <img src={`//placekitten.com/200/300`} alt="kitten" />
      </Box>
    </AnchoredOverlay>
  )
}

export const Playground = (args: Args) => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => {
        setOpen(true)
        action('onOpen')()
      }}
      onClose={() => {
        setOpen(false)
        action('onClose')()
      }}
      width={args.width}
      height={args.height}
      renderAnchor={props => <Button {...props}>Button</Button>}
      overlayProps={args.portalContainerName}
      side={args.side}
    >
      <Box width="100%" height="100%" backgroundColor="thistle" display="flex" flexDirection="column">
        <img src={`//placekitten.com/200/300`} alt="kitten" />
      </Box>
    </AnchoredOverlay>
  )
}
Playground.args = {
  width: 'small',
  height: 'auto',
  portalContainerName: 'Portal name',
  side: 'outside-bottom',
}
Playground.argTypes = {
  width: {
    type: {
      name: 'enum',
      value: ['small', 'medium', 'large', 'xlarge', 'xxlarge', 'auto'],
    },
    portalContainerName: {type: 'string'},
  },
  height: {
    type: {
      name: 'enum',
      value: ['xsmall', 'small', 'medium', 'large', 'xlarge', 'auto', 'initial'],
    },
    portalContainerName: {type: 'string'},
  },
  side: {
    type: {
      name: 'enum',
      value: [
        'inside-top',
        'inside-bottom',
        'inside-left',
        'inside-right',
        'inside-center',
        'outside-top',
        'outside-bottom',
        'outside-left',
        'outside-right',
      ],
    },
  },
  open: {
    control: false,
  },
}
