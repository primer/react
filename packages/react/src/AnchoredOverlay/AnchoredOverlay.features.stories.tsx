import React, {useEffect, useRef, useState} from 'react'
import type {Args, Meta} from '@storybook/react'
import {FocusKeys} from '@primer/behaviors'

import {Avatar, Box, Link, Text} from '..'
import {AnchoredOverlay} from '../AnchoredOverlay'
import Heading from '../Heading'
import Octicon from '../Octicon'
import {Button} from '../Button'
import {registerPortalRoot} from '../Portal'
import {Playground} from './AnchoredOverlay.stories'
import {LocationIcon, RepoIcon} from '@primer/octicons-react'
import {Stack} from '../Stack/Stack'

export default {
  title: 'Components/AnchoredOverlay/Features',
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
      <Text color={'var(--fgColor-muted)'} ml={1}>
        <Link inline muted href="#">
          Monalisa Octocat
        </Link>
      </Text>
    </Stack>
    <Text size="medium">Former beach cat and champion swimmer. Now your friendly octapus with a normal face.</Text>
    <Stack direction="horizontal" gap="none">
      <Octicon color={'var(--fgColor-muted)'} icon={LocationIcon} />
      <Text size="small" color={'var(--fgColor-muted)'} ml={1}>
        Interwebs
      </Text>
    </Stack>
    <Stack direction="horizontal" gap="none">
      <Octicon color={'var(--fgColor-muted)'} icon={RepoIcon} />
      <Text size="small" color={'var(--fgColor-muted)'} ml={1}>
        Owns this repository
      </Text>
    </Stack>
  </Stack>
)

const HeaderAndLayout = ({children}: {children: JSX.Element}) => {
  const scrollingElementRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (scrollingElementRef.current) {
      registerPortalRoot(scrollingElementRef.current, 'scrollingPortal')
    }
  }, [scrollingElementRef])
  return (
    <Box position="absolute" top={0} right={0} bottom={0} left={0} padding={4}>
      <Heading>Header or some such</Heading>
      <Box position="absolute" top={10} right={4} bottom={4} left={4} overflow="scroll" backgroundColor="powderblue">
        {children}
        <Box ref={scrollingElementRef} position="absolute" top={0} left={0} />
      </Box>
    </Box>
  )
}

export const PortalInsideScrollingElement = (args: Args) => {
  const rows = 20
  const columns = 10
  return (
    <HeaderAndLayout>
      <table>
        <tbody>
          {Array(rows)
            .fill(null)
            .map((_, i) => (
              <tr key={i}>
                {Array(columns)
                  .fill(null)
                  .map((_1, j) => (
                    <td key={`${i}${j}`}>
                      <Box m={2}>
                        <Playground {...{...args, portalContainerName: 'scrollingPortal'}} />
                      </Box>
                    </td>
                  ))}
              </tr>
            ))}
        </tbody>
      </table>
    </HeaderAndLayout>
  )
}

export const CustomAnchorId = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Button</Button>}
      anchorId="my-custom-anchor-id"
      overlayProps={{role: 'dialog', 'aria-modal': true, 'aria-label': 'User Card Overlay', sx: {minWidth: '320px'}}}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>{hoverCard}</Box>
    </AnchoredOverlay>
  )
}

export const Height = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Button</Button>}
      height="large"
      overlayProps={{role: 'dialog', 'aria-modal': true, 'aria-label': 'User Card Overlay', sx: {minWidth: '320px'}}}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>{hoverCard}</Box>
    </AnchoredOverlay>
  )
}

export const Width = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Button</Button>}
      width="large"
      overlayProps={{role: 'dialog', 'aria-modal': true, 'aria-label': 'User Card Overlay', sx: {minWidth: '320px'}}}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {hoverCard}
      </Box>
    </AnchoredOverlay>
  )
}

export const AnchorAlignment = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => (
        <Button {...props} block>
          Button
        </Button>
      )}
      align="center"
      overlayProps={{role: 'dialog', 'aria-modal': true, 'aria-label': 'User Card Overlay', sx: {minWidth: '320px'}}}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>{hoverCard}</Box>
    </AnchoredOverlay>
  )
}

export const AnchorSide = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Button</Button>}
      side="outside-right"
      overlayProps={{role: 'dialog', 'aria-modal': true, 'aria-label': 'User Card Overlay', sx: {minWidth: '320px'}}}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>{hoverCard}</Box>
    </AnchoredOverlay>
  )
}

export const OffsetPositionFromAnchor = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Button</Button>}
      anchorOffset={100}
      overlayProps={{role: 'dialog', 'aria-modal': true, 'aria-label': 'User Card Overlay', sx: {minWidth: '320px'}}}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>{hoverCard}</Box>
    </AnchoredOverlay>
  )
}

export const OffsetAlignmentFromAnchor = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Button</Button>}
      alignmentOffset={100}
      overlayProps={{role: 'dialog', 'aria-modal': true, 'aria-label': 'User Card Overlay', sx: {minWidth: '320px'}}}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>{hoverCard}</Box>
    </AnchoredOverlay>
  )
}

export const FocusTrapOverrides = () => {
  const initialFocusRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Button</Button>}
      focusTrapSettings={{initialFocusRef}}
      overlayProps={{role: 'dialog', 'aria-modal': true, 'aria-label': 'Focus Trap Demo Overlay'}}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <Button>First button</Button>
      <Button ref={initialFocusRef}>Initial focus</Button>
    </AnchoredOverlay>
  )
}

export const FocusZoneOverrides = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Button</Button>}
      focusZoneSettings={{bindKeys: FocusKeys.JK}}
      overlayProps={{role: 'dialog', 'aria-modal': true, 'aria-label': 'Focus Zone Demo Overlay'}}
      preventOverflow={false}
    >
      <p>
        Use <kbd>J</kbd> and <kbd>K</kbd> keys to move focus.
      </p>
      <Button>First</Button>
      <Button>Second</Button>
      <Button>Third</Button>
    </AnchoredOverlay>
  )
}

export const OverlayPropsOverrides = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Button</Button>}
      overlayProps={{
        overflow: 'auto',
        maxHeight: 'xsmall',
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'User Card Overlay',
        sx: {minWidth: '320px'},
      }}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <div>Overlay props have been overridden to set: </div>
      <pre>
        <li>overflow: `auto`</li>
        <li>maxHeight: `xsmall`</li>
      </pre>
      <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>{hoverCard}</Box>
    </AnchoredOverlay>
  )
}
