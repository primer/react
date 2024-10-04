import React, {useState} from 'react'
import type {Args, Meta} from '@storybook/react'
import {LocationIcon, RepoIcon} from '@primer/octicons-react'

import {Avatar, Text} from '..'
import {AnchoredOverlay} from '../AnchoredOverlay'
import {Button} from '../Button'
import Octicon from '../Octicon'
import {action} from '@storybook/addon-actions'
import {Stack} from '../Stack/Stack'

export default {
  title: 'Components/AnchoredOverlay',
  component: AnchoredOverlay,
} as Meta

const hoverCard = (
  <Stack gap="condensed" style={{minWidth: '320px', padding: '16px'}}>
    <Stack direction="horizontal" gap="condensed" justify="space-between">
      <Avatar src="https://avatars.githubusercontent.com/u/92997159?v=4" size={48} />
      <Button size="small">Follow</Button>
    </Stack>
    <Stack direction="horizontal" gap="none">
      <Text weight="medium">monalisa</Text>
      <Text color={'var(--fgColor-muted)'} ml={1}>
        Monalisa Octocat
      </Text>
    </Stack>
    <Text fontSize={14}>Former beach cat and champion swimmer. Now your friendly octapus with a normal face.</Text>
    <Stack direction="horizontal" gap="none">
      <Octicon color={'var(--fgColor-muted)'} icon={LocationIcon} />
      <Text fontSize={12} color={'var(--fgColor-muted)'} ml={1}>
        Interwebs
      </Text>
    </Stack>
    <Stack direction="horizontal" gap="none">
      <Octicon color={'var(--fgColor-muted)'} icon={RepoIcon} />
      <Text fontSize={12} color={'var(--fgColor-muted)'} ml={1}>
        Owns this repository
      </Text>
    </Stack>
  </Stack>
)

export const Default = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Button</Button>}
    >
      {hoverCard}
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
      {hoverCard}
    </AnchoredOverlay>
  )
}
Playground.args = {
  width: 'auto',
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
