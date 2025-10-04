import {useEffect, useRef, useState} from 'react'
import type {Args, Meta} from '@storybook/react-vite'
import {FocusKeys} from '@primer/behaviors'
import {Avatar, Link} from '..'
import {AnchoredOverlay} from '../AnchoredOverlay'
import Heading from '../Heading'
import Octicon from '../Octicon'
import {Button} from '../Button'
import {registerPortalRoot} from '../Portal'
import {Playground} from './AnchoredOverlay.stories'
import {LocationIcon, RepoIcon} from '@primer/octicons-react'
import {Stack} from '../Stack/Stack'
import classes from './AnchoredOverlay.features.stories.module.css'

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
      <span className={classes.UserName}>monalisa</span>
      <span className={classes.UserMeta}>
        <Link inline muted href="#">
          Monalisa Octocat
        </Link>
      </span>
    </Stack>
    <span className={classes.Bio}>
      Former beach cat and champion swimmer. Now your friendly octopus with a normal face.
    </span>
    <Stack direction="horizontal" gap="none">
      <Octicon className={classes.Icon} icon={LocationIcon} />
      <span className={classes.MetaMuted}>Interwebs</span>
    </Stack>
    <Stack direction="horizontal" gap="none">
      <Octicon className={classes.Icon} icon={RepoIcon} />
      <span className={classes.MetaMuted}>Owns this repository</span>
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
    <div className={classes.HeaderAndLayout}>
      <Heading>Header or some such</Heading>
      <div className={classes.ScrollingRegion}>
        {children}
        <div ref={scrollingElementRef} className={classes.PortalRootRegion} />
      </div>
    </div>
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
                      <div className={classes.PlaygroundCell}>
                        <Playground {...{...args, portalContainerName: 'scrollingPortal'}} />
                      </div>
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
      overlayProps={{
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'User Card Overlay',
        className: classes.Overlay,
      }}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <div className={classes.FlexColFill}>{hoverCard}</div>
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
      overlayProps={{
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'User Card Overlay',
        className: classes.Overlay,
      }}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <div className={classes.FlexColFill}>{hoverCard}</div>
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
      overlayProps={{
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'User Card Overlay',
        className: classes.Overlay,
      }}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <div className={classes.FlexColFill}>{hoverCard}</div>
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
      overlayProps={{
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'User Card Overlay',
        className: classes.Overlay,
      }}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <div className={classes.FlexColFill}>{hoverCard}</div>
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
      overlayProps={{
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'User Card Overlay',
        className: classes.Overlay,
      }}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <div className={classes.FlexColFill}>{hoverCard}</div>
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
      overlayProps={{
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'User Card Overlay',
        className: classes.Overlay,
      }}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <div className={classes.FlexColFill}>{hoverCard}</div>
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
      overlayProps={{
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'User Card Overlay',
        className: classes.Overlay,
      }}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <div className={classes.FlexColFill}>{hoverCard}</div>
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
      overlayProps={{
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'Focus Trap Demo Overlay',
        className: classes.Overlay,
      }}
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
      overlayProps={{
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'Focus Zone Demo Overlay',
        className: classes.Overlay,
      }}
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
        className: classes.Overlay,
      }}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <div>Overlay props have been overridden to set: </div>
      <pre>
        <li>overflow: `auto`</li>
        <li>maxHeight: `xsmall`</li>
      </pre>
      <div className={classes.FlexColFill}>{hoverCard}</div>
    </AnchoredOverlay>
  )
}

export const FullscreenVariant = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Open Fullscreen on Narrow</Button>}
      variant={{narrow: 'fullscreen', regular: 'anchored'}}
      overlayProps={{
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'Fullscreen Overlay Demo',
        className: classes.Overlay,
        overflow: 'auto',
      }}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
      width="large"
    >
      <div className={classes.FlexColFill}>
        <Stack gap="normal" style={{padding: '16px'}}>
          <Heading>Fullscreen Overlay Demo</Heading>
          <div>
            This overlay will appear fullscreen on narrow viewports (less than 768px) and as a regular anchored overlay
            on wider screens.
          </div>
          <div>
            Try resizing your browser window to see the responsive behavior in action. The overlay includes a close
            button when in fullscreen mode.
          </div>
          {hoverCard}
        </Stack>
      </div>
    </AnchoredOverlay>
  )
}
