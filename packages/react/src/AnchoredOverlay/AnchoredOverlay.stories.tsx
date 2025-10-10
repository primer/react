import {useState} from 'react'
import type {Args, Meta} from '@storybook/react-vite'
import {LocationIcon, RepoIcon} from '@primer/octicons-react'

import {Avatar, Link, Text} from '..'
import {AnchoredOverlay} from '../AnchoredOverlay'
import {Button} from '../Button'
import Octicon from '../Octicon'
import {action} from 'storybook/actions'
import {Stack} from '../Stack/Stack'
import classes from './AnchoredOverlay.stories.module.css'

export default {
  title: 'Components/AnchoredOverlay',
  component: AnchoredOverlay,
} as Meta

const hoverCard = (
  <Stack gap="condensed" style={{padding: '16px'}}>
    <Stack direction="horizontal" gap="condensed" justify="space-between">
      <Avatar src="https://avatars.githubusercontent.com/u/7143434?v=4" size={48} />
      <Button size="small">Follow</Button>
    </Stack>
    <Stack direction="horizontal" gap="none">
      <Text weight="medium">monalisa</Text>
      <Text className={classes.TextMutedWithMargin}>
        <Link inline muted href="#">
          Monalisa Octocat
        </Link>
      </Text>
    </Stack>
    <Text size="medium">Former beach cat and champion swimmer. Now your friendly octapus with a normal face.</Text>
    <Stack direction="horizontal" gap="none">
      <Octicon className={classes.Icon} icon={LocationIcon} />
      <Text className={classes.TextSmallMutedWithMargin}>Interwebs</Text>
    </Stack>
    <Stack direction="horizontal" gap="none">
      <Octicon className={classes.Icon} icon={RepoIcon} />
      <Text className={classes.TextSmallMutedWithMargin}>Owns this repository</Text>
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
      overlayProps={{role: 'dialog', 'aria-modal': true, 'aria-label': 'User Card Overlay', style: {minWidth: '320px'}}}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
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
      overlayProps={{
        ...args.portalContainerName,
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'User Card Overlay',
        style: {minWidth: '320px'},
      }}
      side={args.side}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
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
