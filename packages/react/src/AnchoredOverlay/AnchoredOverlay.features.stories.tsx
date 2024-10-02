import React, {useEffect, useRef, useState} from 'react'
import type {Args, Meta} from '@storybook/react'
import {FocusKeys} from '@primer/behaviors'

import {Avatar, Box, Text} from '..'
import {AnchoredOverlay} from '../AnchoredOverlay'
import Heading from '../Heading'
import Octicon from '../Octicon'
import {Button} from '../Button'
import {registerPortalRoot} from '../Portal'
import {Playground} from './AnchoredOverlay.stories'
import {LocationIcon, RepoIcon} from '@primer/octicons-react'

export default {
  title: 'Components/AnchoredOverlay/Features',
  component: AnchoredOverlay,
} as Meta

const hoverCard = (
  <Box p={3} minWidth={320}>
    <Box display="flex" flexDirection="column" sx={{position: 'relative'}}>
      <Avatar src="https://avatars.githubusercontent.com/u/92997159?v=4" size={48} />
      <Box display="flex">
        <Text weight="medium">monalisa</Text>
        <Text color={'var(--fgColor-muted)'} ml={1}>
          Monalisa Octocat
        </Text>
      </Box>
      <Text fontSize={14}>Former beach cat and champion swimmer. Now your friendly octapus with a normal face.</Text>
      <Box display="flex" mt={1}>
        <Octicon color={'var(--fgColor-muted)'} icon={LocationIcon} />
        <Text fontSize={12} ml={1} color={'var(--fgColor-muted)'}>
          Interwebs
        </Text>
      </Box>
      <Box display="flex" mt={1}>
        <Octicon color={'var(--fgColor-muted)'} icon={RepoIcon} />
        <Text fontSize={12} ml={1} color={'var(--fgColor-muted)'}>
          Owns this repository
        </Text>
      </Box>
      <Button
        size="small"
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
        }}
      >
        Follow
      </Button>
    </Box>
  </Box>
)

const HeaderAndLayout = ({children}: {children: JSX.Element}) => {
  const scrollingElementRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (scrollingElementRef.current) {
      registerPortalRoot(scrollingElementRef.current, 'scrollingPortal')
    }
  }, [scrollingElementRef])
  return (
    <Box position="absolute" top={0} right={0} bottom={0} left={0} padding={4} backgroundColor="lavenderblush">
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
    >
      <Box width="100%" height="100%" display="flex" flexDirection="column">
        {hoverCard}
      </Box>
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
    >
      <Box width="100%" height="100%" display="flex" flexDirection="column">
        {hoverCard}
      </Box>
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
    >
      <Box width="100%" height="100%" display="flex" flexDirection="column">
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
    >
      <Box width="100%" height="100%" display="flex" flexDirection="column">
        {hoverCard}
      </Box>
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
    >
      <Box width="100%" height="100%" display="flex" flexDirection="column">
        {hoverCard}
      </Box>
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
    >
      <Box width="100%" height="100%" backgroundColor="thistle" display="flex" flexDirection="column">
        {hoverCard}
      </Box>
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
    >
      <Box width="100%" height="100%" display="flex" flexDirection="column">
        {hoverCard}
      </Box>
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
      }}
    >
      <div>Overlay props have been overridden to set: </div>
      <pre>
        <li>overflow: `auto`</li>
        <li>maxHeight: `xsmall`</li>
      </pre>
      <Box width="100%" height="100%" display="flex" flexDirection="column">
        {hoverCard}
      </Box>
    </AnchoredOverlay>
  )
}
